// Custom formatter function for money values
Number.prototype.money = function () {
    return this.toFixed(2);
};

$(document).ready(function () {
    $("#calculate").on("click", function () {
        const inputObjects = [
            {
                id: "entry",
                label: "Entry",
                isValid: isValidDecimal,
                error: "- Please provide a valid Entry price.",
                extract: floatExtractor,
                format: pennyFormatter,
                doubleSpace: false
            },
            {
                id: "sl",
                label: "SL",
                isValid: isValidDecimal,
                error: "- Please provide a valid SL price.",
                extract: floatExtractor,
                format: pennyFormatter,
                doubleSpace: false
            },
            {
                id: "tp",
                label: "TP",
                isValid: isValidDecimal,
                error: "- Please provide a valid TP price.",
                extract: floatExtractor,
                format: pennyFormatter,
                doubleSpace: true
            }
        ];

        const investment = $("#maxInvestment").val();
        const maxRisk = $("#maxRisk").val();
        if (investment) {
            inputObjects.push({
                id: "maxInvestment",
                label: "Max Investment",
                isValid: isValidMoneyAmount,
                error: "- Please provide a valid Max Investment amount.",
                extract: floatExtractor,
                format: poundFormatter,
                doubleSpace: false
            });
            inputObjects.push({
                id: "maxRisk",
                label: "Max Risk",
                isValid: isValidPercentage,
                error: "- Please provide a valid Max Risk percentage.",
                extract: intExtractor,
                format: percentageFormatter,
                doubleSpace: true
            });
            const tpObject = inputObjects.find(obj => obj.id === "tp");
            if (tpObject) {
                tpObject.doubleSpace = false;
            }
        }

        const validationErrors = {};
        const inputValues = inputObjects.map(({id, isValid, extract, error}) => {
            const value = extract(id);

            if (value === null || !isValid(value)) {
                validationErrors[id] = error;
            } else if (id === "maxInvestment") {
                const maxRiskObject = inputObjects.find(obj => obj.id === "maxRisk");
                let maxRiskVal = maxRiskObject.extract(maxRiskObject.id);
                if (maxRiskVal === null) {
                    validationErrors[maxRiskObject.id] = maxRiskObject.error;
                }
            }
            return value;
        });

        if (Object.keys(validationErrors).length > 0) {
            const errorMessage = Object.values(validationErrors).join("\n");
            alert("Please address the following:\n" + errorMessage);
            return;
        }

        const outputEntries = inputObjects.map(({label, format, doubleSpace}, index) => {
            const value = format(inputValues[index]);
            const spacing = doubleSpace ? ' double-space' : '';
            return `<div class="text-secondary ${spacing}">${label}: ${value}</div>`;
        });

        const entry = inputValues[0];
        const sl = inputValues[1];
        const tp = inputValues[2];
        const risk = entry - sl;
        const reward = tp - entry;
        const rMultiple = reward / risk;

        outputEntries.push(`<div class="text-danger">Risk: ${risk.money()}p (${((risk / entry) * 100).toFixed(2)}%)</div>`);
        outputEntries.push(`<div class="text-success">Reward: ${reward.money()}p (${((reward / entry) * 100).toFixed(2)}%)</div>`);
        outputEntries.push(`<div class="text-dark double-space">RR: 1:${rMultiple.toFixed(2)}</div>`);

        let sharesToBuy = '';
        let estimatedInvestment = '';
        if (investment && maxRisk) {
            sharesToBuy = calculateSharesToBuy(entry, sl, investment, maxRisk);
            estimatedInvestment = calculateEstimatedInvestment(entry, sharesToBuy);

            outputEntries.push(`<div class="text-info ">Shares to buy: ${sharesToBuy}</div>`);
            outputEntries.push(`<div class="text-info ">Estimated Investment: £${estimatedInvestment.money()}</div>`);
        }

        // Display output
        const $out = $("#out");
        $out.empty();
        outputEntries.forEach((e) => $out.append(e));
    });

    // Extractor function for floating-point values
    function floatExtractor(id) {
        return parseFloat($(`#${id}`).val().trim());
    }

    // Extractor function for integer values
    function intExtractor(id) {
        return parseInt($(`#${id}`).val().trim(), 10);
    }

    // Custom formatter function for money values
    function pennyFormatter(value) {
        return value.money() + 'p';
    }

    function poundFormatter(value) {
        return value.money();
    }

    // Custom formatter function for percentage values
    function percentageFormatter(value) {
        return value + '%';
    }

    // Function to calculate shares to buy based on entry price, stop loss price, investment amount, and max risk percentage
    function calculateSharesToBuy(entry, sl, investment, maxRisk) {
        const risk = entry - sl;
        const riskAmount = (risk / entry) * investment;
        const sharesToBuy = riskAmount / (entry * (maxRisk / 100));
        return Math.floor(sharesToBuy);
    }

    // Function to calculate estimated investment based on entry price and shares to buy
    function calculateEstimatedInvestment(entry, sharesToBuy) {
        return (entry * sharesToBuy) / 100;
    }
});
