// Function to validate decimal input
const isValidDecimal = (input) => {
    return input !== '' && !isNaN(input) && isFinite(input);
};

// Function to validate money amount
const isValidMoneyAmount = (input) => {
    return /^\d+(\.\d{1,2})?$/.test(input);
};

// Function to validate percentage
const isValidPercentage = (input) => {
    return /^\d+(\.\d{1,2})?$/.test(input) && parseFloat(input) <= 100;
};

// Function to format money value
const pennyFormatter = (value) => `${value}p`;

const poundFormatter = (value) => `£${value}`;

// Function to format percentage value
const percentageFormatter = (value) => `${value}%`;

// Function to calculate risk, reward, and rMultiple
const calculateRiskReward = (entry, sl, tp) => {
    const risk = entry - sl;
    const reward = tp - entry;
    const rMultiple = reward / risk;
    return {risk, reward, rMultiple};
};

// Function to validate input fields
const validateInputs = (inputObjects) => {
    const errors = {};

    inputObjects.forEach((inputObject, index) => {
        const value = inputObject.value.trim();
        const validator = inputObject.validator || isValidDecimal;

        if (!validator(value)) {
            errors[`input${index}`] = inputObject.error;
        }
    });

    return errors;
};

// Function to format value using formatter function
const formatValue = (value, formatter) => {
    return formatter(value);
};

// Extend Number prototype to include a money method
Number.prototype.money = function () {
    return `${this.toFixed(2)}p`;
};

// Export functions
window.isValidDecimal = isValidDecimal;
window.isValidMoneyAmount = isValidMoneyAmount;
window.isValidPercentage = isValidPercentage;
window.moneyFormatter = pennyFormatter;
window.percentageFormatter = percentageFormatter;
window.calculateRiskReward = calculateRiskReward;
window.validateInputs = validateInputs;
window.formatValue = formatValue;
window.money = () => {
};
