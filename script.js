@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;700&display=swap');

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Noto Sans KR', sans-serif;
}

body {
    background: linear-gradient(135deg, #74ebd5 0%, #9face6 100%);
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #333;
}

.weather-container {
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(10px);
    width: 350px;
    padding: 30px;
    border-radius: 20px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    text-align: center;
}

.header h2 {
    font-size: 1.2rem;
    font-weight: 700;
    color: #2c3e50;
}

.header p {
    font-size: 0.85rem;
    color: #7f8c8d;
    margin-top: 5px;
}

.main-weather {
    margin: 30px 0;
}

.main-weather i {
    font-size: 4rem;
    color: #3498db;
    margin-bottom: 15px;
}

#temperature {
    font-size: 3.5rem;
    font-weight: 700;
    color: #2c3e50;
}

#weather-desc {
    font-size: 1.1rem;
    font-weight: 700;
    color: #34495e;
    margin-top: 5px;
}

.details {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.detail-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 33%;
}

.detail-item i {
    font-size: 1.2rem;
    color: #7f8c8d;
    margin-bottom: 8px;
}

.detail-item span {
    font-weight: 700;
    font-size: 1rem;
    color: #2c3e50;
}

.detail-item small {
    font-size: 0.75rem;
    color: #95a5a6;
    margin-top: 4px;
}
