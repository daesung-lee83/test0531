// 제공해주신 API 인증키
const API_KEY = '93e350048468aa2838258d673b9c79fa9370a38e823c47978b200a8b071cc397';
// 격자 좌표 (현재 위치 기준)
const NX = 61;
const NY = 127;

// 1. 기상청 API 호출을 위한 현재 시간 계산 로직 (매시 40분 기준)
function getBaseDateTime() {
    const now = new Date();
    let year = now.getFullYear();
    let month = now.getMonth() + 1;
    let date = now.getDate();
    let hours = now.getHours();
    let minutes = now.getMinutes();

    // 40분 이전이면 이전 시간대의 실황 데이터를 가져와야 함
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
    const baseTime = `${String(hours).padStart(2, '0')}00`; // 분은 항상 00으로 고정

    return { baseDate, baseTime, formattedTime: `${month}월 ${date}일 ${hours}시 기준` };
}

// 2. 강수형태(PTY) 코드에 따른 상태 및 아이콘 변환
function getWeatherStatus(ptyCode) {
    const status = {
        '0': { desc: '비 안옴 (맑음/흐림)', icon: 'fa-sun' }, // 실황에서는 하늘상태를 알 수 없어 기본값 적용
        '1': { desc: '비', icon: 'fa-cloud-rain' },
        '2': { desc: '비/눈', icon: 'fa-cloud-meatball' },
        '3': { desc: '눈', icon: 'fa-snowflake' },
        '5': { desc: '빗방울', icon: 'fa-cloud-showers-heavy' },
        '6': { desc: '빗방울/눈날림', icon: 'fa-smog' },
        '7': { desc: '눈날림', icon: 'fa-wind' }
    };
    return status[ptyCode] || { desc: '상태 알 수 없음', icon: 'fa-cloud' };
}

// 3. API 호출 및 화면 렌더링
async function fetchWeather() {
    const { baseDate, baseTime, formattedTime } = getBaseDateTime();
    
    // API URL 구성
    const url = `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst?serviceKey=${API_KEY}&pageNo=1&numOfRows=1000&dataType=JSON&base_date=${baseDate}&base_time=${baseTime}&nx=${NX}&ny=${NY}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        const items = data.response.body.items.item;

        // 변수 초기화
        let temperature = '';
        let humidity = '';
        let wind = '';
        let rain = '';
        let ptyCode = '0';

        // 항목(category)별로 데이터 분류
        items.forEach(item => {
            if (item.category === 'T1H') temperature = item.obsrValue; // 기온
            if (item.category === 'REH') humidity = item.obsrValue; // 습도
            if (item.category === 'WSD') wind = item.obsrValue; // 풍속
            if (item.category === 'RN1') rain = item.obsrValue; // 1시간 강수량
            if (item.category === 'PTY') ptyCode = item.obsrValue; // 강수형태
        });

        // 강수형태에 따른 아이콘 및 설명 가져오기
        const weatherInfo = getWeatherStatus(ptyCode);

        // HTML DOM 업데이트
        document.getElementById('time-info').innerText = formattedTime;
        document.getElementById('temperature').innerText = `${temperature}°C`;
        document.getElementById('humidity').innerText = `${humidity}%`;
        document.getElementById('wind').innerText = `${wind} m/s`;
        document.getElementById('rain').innerText = `${rain} mm`;
        document.getElementById('weather-desc').innerText = weatherInfo.desc;
        
        // 아이콘 클래스 변경
        const iconElement = document.getElementById('weather-icon');
        iconElement.className = `fas ${weatherInfo.icon}`;
        if(ptyCode !== '0') {
            iconElement.style.color = '#7f8c8d'; // 비나 눈이 올 때는 아이콘 색상을 어둡게
        }

    } catch (error) {
        console.error('날씨 정보를 가져오는 중 에러 발생:', error);
        document.getElementById('time-info').innerText = '데이터를 불러올 수 없습니다.';
        document.getElementById('weather-icon').className = 'fas fa-exclamation-triangle';
    }
}

// 스크립트 로드 시 즉시 실행
fetchWeather();
