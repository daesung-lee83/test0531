const API_KEY = '93e350048468aa2838258d673b9c79fa9370a38e823c47978b200a8b071cc397';
const NX = 61;
const NY = 127;

// 1. 기상청 API 업데이트 주기(매시 40분) 계산 함수
function getBaseDateTime() {
    const now = new Date();
    let year = now.getFullYear();
    let month = now.getMonth() + 1;
    let date = now.getDate();
    let hours = now.getHours();
    let minutes = now.getMinutes();

    // 40분 이전이면 이전 시간의 데이터를 가져옴
    if (minutes < 40) {
        hours = hours - 1;
        if (hours < 0) {
            hours = 23;
            now.setDate(now.getDate() - 1);
            year = now.getFullYear();
            month = now.getMonth() + 1;
            date = now.getDate();
        }
    }

    const baseDate = `${year}${String(month).padStart(2, '0')}${String(date).padStart(2, '0')}`;
    const baseTime = `${String(hours).padStart(2, '0')}00`; 

    return { baseDate, baseTime, formattedTime: `${month}월 ${date}일 ${hours}시 실황` };
}

// 2. 강수형태(PTY) 코드 변환 함수
function getWeatherStatus(ptyCode) {
    const status = {
        '0': { desc: '맑음/흐림', icon: 'fa-sun' },
        '1': { desc: '비', icon: 'fa-cloud-rain' },
        '2': { desc: '비/눈', icon: 'fa-cloud-meatball' },
        '3': { desc: '눈', icon: 'fa-snowflake' },
        '5': { desc: '빗방울', icon: 'fa-cloud-showers-heavy' },
        '6': { desc: '빗방울/눈날림', icon: 'fa-smog' },
        '7': { desc: '눈날림', icon: 'fa-wind' }
    };
    return status[ptyCode] || { desc: '데이터 오류', icon: 'fa-cloud' };
}

// 3. 실시간 기상 데이터 호출 함수
async function fetchWeather() {
    const { baseDate, baseTime, formattedTime } = getBaseDateTime();
    
    // 반드시 https 정책을 준수해야 깃허브에서 차단되지 않습니다.
    const url = `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst?serviceKey=${API_KEY}&pageNo=1&numOfRows=1000&dataType=JSON&base_date=${baseDate}&base_time=${baseTime}&nx=${NX}&ny=${NY}`;

    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`네트워크 응답 불안정 (상태코드: ${response.status})`);
        }

        const data = await response.json();
        
        // 공공데이터포털 자체 에러 발생 시 처리
        if (!data.response || data.response.header.resultCode !== '00') {
            const errorMsg = data.response ? data.response.header.resultMsg : 'API 구조 오류';
            throw new Error(`기상청 API 에러: ${errorMsg}`);
        }

        const items = data.response.body.items.item;

        let temperature = '';
        let humidity = '';
        let wind = '';
        let rain = '';
        let ptyCode = '0';

        items.forEach(item => {
            if (item.category === 'T1H') temperature = item.obsrValue;
            if (item.category === 'REH') humidity = item.obsrValue;
            if (item.category === 'WSD') wind = item.obsrValue;
            if (item.category === 'RN1') rain = item.obsrValue;
            if (item.category === 'PTY') ptyCode = item.obsrValue;
        });

        const weatherInfo = getWeatherStatus(ptyCode);

        // 화면 UI 반영
        document.getElementById('time-info').innerText = formattedTime;
        document.getElementById('temperature').innerText = `${temperature}°C`;
        document.getElementById('humidity').innerText = `${humidity}%`;
        document.getElementById('wind').innerText = `${wind} m/s`;
        document.getElementById('rain').innerText = `${rain} mm`;
        document.getElementById('weather-desc').innerText = weatherInfo.desc;
        
        const iconElement = document.getElementById('weather-icon');
        iconElement.className = `fas ${weatherInfo.icon}`;
        
        // 비/눈이 올 때 아이콘 색상 변경
        if(ptyCode !== '0') {
            iconElement.style.color = '#7f8c8d'; 
        } else {
            iconElement.style.color = '#3498db';
        }

    } catch (error) {
        console.error('날씨 데이터 로드 실패:', error);
        
        // 사용자가 깃허브 페이지 등에서 에러 원인을 파악할 수 있도록 화면에 노출
        document.getElementById('time-info').innerText = '데이터 로딩 실패';
        document.getElementById('weather-icon').className = 'fas fa-exclamation-triangle';
        document.getElementById('weather-icon').style.color = '#e74c3c';
        document.getElementById('weather-desc').innerText = '네트워크/인증키 확인 필요';
        
        // 상세 에러를 기온 영역에 임시 표시
        document.getElementById('temperature').style.fontSize = '1.5rem';
        document.getElementById('temperature').innerText = error.message.substring(0, 20);
    }
}

// 페이지가 로드되면 즉시 실행
window.addEventListener('DOMContentLoaded', fetchWeather);
