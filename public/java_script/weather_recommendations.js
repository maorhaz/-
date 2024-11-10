let CONFIG = {
    API_KEY: '', 
    REGIONS: {
        center: {
            name: 'מרכז',
            mainCity: '293397', // Tel Aviv
            displayName: 'אזור המרכז'
        },
        south: {
            name: 'דרום',
            mainCity: '295530', // Beer Sheva
            displayName: 'אזור הדרום'
        },
        jerusalem: {
            name: 'ירושלים והסביבה',
            mainCity: '281184', // Jerusalem
            displayName: 'אזור ירושלים והסביבה'
        },
        north: {
            name: 'צפון',
            mainCity: '294801', // Haifa
            displayName: 'אזור הצפון'
        }
    }
};

const DISHES_DB = {
    hot: [ // 25°C and above
        {
            name: 'קרפציו דג ים',
            description: 'פרוסות דקות של דג ים טרי עם שמן זית ולימון',
            ingredients: ['דג ים טרי', 'שמן זית', 'לימון', 'מלח ים'],
            image: '../resources/images/recipes_pics/1.jpg'
        },
        {
            name: 'סלט יווני עם גבינת פטה',
            description: 'סלט קיצי מרענן עם גבינה מלוחה',
            ingredients: ['גבינת פטה', 'עגבניות שרי', 'מלפפונים', 'זיתים'],
            image: '../resources/images/recipes_pics/2.jpg'
        },
        {
            name: 'טרטר סלמון',
            description: 'טרטר סלמון טרי עם אבוקדו ועשבי תיבול',
            ingredients: ['סלמון טרי', 'אבוקדו', 'בצל סגול', 'עשבי תיבול'],
            image: '../resources/images/recipes_pics/3.jpg'
        },
    ],
    moderate: [ // 15-25°C
        {
            name: 'פלטת גבינות מובחרות',
            description: 'מבחר גבינות איכותיות עם לחם טרי',
            ingredients: ['גבינה צהובה מיושנת', 'גבינת עיזים', 'גבינה כחולה', 'ריבה ביתית'],
            image: '../resources/images/recipes_pics/4.jpeg'
        },
        {
            name: 'לזניית גבינות',
            description: 'לזניה ביתית עם מבחר גבינות ורוטב עגבניות',
            ingredients: ['גבינת ריקוטה', 'מוצרלה', 'פרמזן', 'רוטב עגבניות'],
            image: '../resources/images/recipes_pics/5.jpg'
        },
        {
            name: 'פילה סלמון צרוב',
            description: 'פילה סלמון צרוב עם ירקות מוקפצים',
            ingredients: ['סלמון טרי', 'ירקות עונתיים', 'רוטב טריאקי', 'אורז'],
            image: '../resources/images/recipes_pics/6.jpg'
        }
    ],
    cold: [ // below 15°C
        {
            name: 'מרק גבינות חם',
            description: 'מרק גבינות מחמם ומנחם',
            ingredients: ['גבינת שמנת', 'גבינה צהובה', 'שמנת מתוקה', 'קרוטונים'],
            image: '../resources/images/recipes_pics/7.jpg'
        },
        {
            name: 'פילה דניס בתנור',
            description: 'פילה דניס אפוי בתנור עם ירקות שורש',
            ingredients: ['דג דניס', 'ירקות שורש', 'שמן זית', 'עשבי תיבול'],
            image: '../resources/images/recipes_pics/8.jpg'
        },
        {
            name: 'קיש גבינות',
            description: 'קיש גבינות חם עם ירקות קלויים',
            ingredients: ['גבינת עיזים', 'מוצרלה', 'ירקות קלויים', 'בצק פריך'],
            image: '../resources/images/recipes_pics/9.jpg'
        }
    ]
};

class WeatherRecommendations {
    constructor() {
        this.initialize();
    }

    async initialize() {
        try {
            console.log('Fetching API key from server...');
            const response = await fetch('/api/weather-config');
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to fetch API key');
            }

            const data = await response.json();
            console.log('Received response from server:', data);

            if (!data.apiKey) {
                throw new Error('API key not found in server response');
            }

            CONFIG.API_KEY = data.apiKey;
            console.log('API key successfully set:', CONFIG.API_KEY);

            this.init();
        } catch (error) {
            console.error('Failed to initialize weather app:', error);
            this.displayError(`שגיאה באתחול המערכת: ${error.message}`);
        }
    }

    init() {
        this.setupRegionSelector();
        this.setupEventListeners();
        // checks for default region in URL
        const urlParams = new URLSearchParams(window.location.search);
        const defaultRegion = urlParams.get('region');
        if (defaultRegion && CONFIG.REGIONS[defaultRegion]) {
            this.handleRegionChange(defaultRegion);
            document.getElementById('region-select').value = defaultRegion;
        }
    }

    setupRegionSelector() {
        const regionSelect = document.getElementById('region-select');
        regionSelect.innerHTML = '<option value="">בחר אזור</option>';

        // checks regions
        for (const [key, region] of Object.entries(CONFIG.REGIONS)) {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = region.displayName;
            regionSelect.appendChild(option);
        }
    }

    setupEventListeners() {
        const regionSelect = document.getElementById('region-select');
        regionSelect.addEventListener('change', () => this.handleRegionChange(regionSelect.value));
    }

    async handleRegionChange(regionKey) {
        if (!regionKey) {
            this.clearDisplay();
            return;
        }

        try {
            const weatherData = await this.fetchWeatherData(CONFIG.REGIONS[regionKey].mainCity);
            this.displayWeatherAndRecommendations(weatherData, regionKey);
        } catch (error) {
            this.displayError(error.message);
        }
    }

    async fetchWeatherData(cityId) {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?id=${cityId}&appid=${CONFIG.API_KEY}&units=metric&lang=he`
        );
        
        if (!response.ok) {
            throw new Error('שגיאה בקבלת נתוני מזג האוויר');
        }

        return await response.json();
    }

    displayWeatherAndRecommendations(weatherData, regionKey) {
        const weatherResult = document.getElementById('weatherResult');
        const temp = Math.round(weatherData.main.temp);
        const recommendedDishes = this.getRecommendedDishes(temp);
        const region = CONFIG.REGIONS[regionKey];
        
        weatherResult.innerHTML = `
            <div class="weather-info">
                <h3>מזג האוויר ב${region.displayName}:</h3>
                <div class="weather-details">
                    <div class="weather-detail">
                        <strong>טמפרטורה:</strong> ${temp}°C
                    </div>
                    <div class="weather-detail">
                        <strong>תחושה כמו:</strong> ${Math.round(weatherData.main.feels_like)}°C
                    </div>
                    <div class="weather-detail">
                        <strong>לחות:</strong> ${weatherData.main.humidity}%
                    </div>
                    <div class="weather-detail">
                        <strong>תנאים:</strong> ${weatherData.weather[0].description}
                    </div>
                </div>
            </div>

            <div class="recommendations">
                <h3>המלצות למנות מותאמות למזג האוויר:</h3>
                <div class="recommendations-grid">
                    ${recommendedDishes.map(dish => this.createDishCard(dish)).join('')}
                </div>
            </div>
        `;
    }

    createDishCard(dish) {
        return `
            <div class="dish-card">
                <img src="${dish.image}" alt="${dish.name}" class="dish-image">
                <div class="dish-content">
                    <h4>${dish.name}</h4>
                    <p class="description">${dish.description}</p>
                    <div class="ingredients">
                        <strong>רכיבים:</strong>
                        <ul>
                            ${dish.ingredients.map(ingredient => 
                                `<li>${ingredient}</li>`
                            ).join('')}
                        </ul>
                    </div>
                </div>
            </div>
        `;
    }

    getRecommendedDishes(temperature) {
        if (temperature >= 25) {
            return DISHES_DB.hot;
        } else if (temperature >= 15) {
            return DISHES_DB.moderate;
        } else {
            return DISHES_DB.cold;
        }
    }

    clearDisplay() {
        const weatherResult = document.getElementById('weatherResult');
        weatherResult.innerHTML = `
            <div class="info-message">
                <p>נא לבחור אזור לקבלת המלצות</p>
            </div>
        `;
    }

    displayError(message) {
        const weatherResult = document.getElementById('weatherResult');
        weatherResult.innerHTML = `
            <div class="error">
                <p>שגיאה: ${message}</p>
                <p>אנא נסה שוב מאוחר יותר</p>
            </div>
        `;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new WeatherRecommendations();
});