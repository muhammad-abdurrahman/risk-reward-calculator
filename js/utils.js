// Function to validate decimal input
const isValidDecimal = (input) => {
    return input !== '' && !isNaN(input) && isFinite(input);
};

// Function to validate money amount
const isValidMoneyAmount = (input) => {
    return /^\d+(\.\d{1,2})?$/.test(input) && input > 0;
};

// Function to validate percentage
const isValidPercentage = (input) => {
    return /^\d+(\.\d{1,2})?$/.test(input) && parseFloat(input) <= 100 && parseFloat(input) > 0;
};

// Function to format money value
const pennyFormatter = (value) => `${new Intl.NumberFormat('en-US').format(value)}p`;

const poundFormatter = (value) => `£${new Intl.NumberFormat('en-US').format(value)}`;

// Function to format percentage value
const percentageFormatter = (value) => `${new Intl.NumberFormat(
    'en-US',
    {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }
).format(value)}%`;

// Extractor function for floating-point values
const floatExtractor = (id) => parseFloat($(`#${id}`).val().trim());

// Extractor function for integer values
const intExtractor = (id) => parseInt($(`#${id}`).val().trim(), 10);

// Function to calculate shares to buy based on entry price, stop loss price, investment amount, and max risk percentage
const calculateSharesToBuy = (entry, sl, maxInvestment, maxRisk) => {
    const risk = entry - sl;
    const maxRiskAmount = maxInvestment * (maxRisk / 100);
    const sharesToBuy = Math.min(maxRiskAmount / risk, maxInvestment / entry);
    return Math.floor(sharesToBuy)*100;
};

// Function to calculate estimated investment based on entry price and shares to buy
const calculateEstimatedInvestment = (entry, sharesToBuy) => (entry / 100 * sharesToBuy);

const calculateInvestmentChange = (investment, percent) => investment * (percent / 100);

// Extend Number prototype to include a money method
Number.prototype.money = function () {
    return this.toFixed(2);
};

// Export functions
window.isValidDecimal = isValidDecimal;
window.isValidMoneyAmount = isValidMoneyAmount;
window.isValidPercentage = isValidPercentage;
window.pennyFormatter = pennyFormatter;
window.poundFormatter = poundFormatter;
window.percentageFormatter = percentageFormatter;
window.floatExtractor = floatExtractor;
window.intExtractor = intExtractor;
window.calculateSharesToBuy = calculateSharesToBuy;
window.calculateEstimatedInvestment = calculateEstimatedInvestment;
window.calculateInvestmentChange = calculateInvestmentChange;
window.money = () => {
};
