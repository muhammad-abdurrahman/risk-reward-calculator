$(document).ready(function () {
    $("#calculate").on("click", function () {
        const inputObjects = [
            {
                id: "entry",
                label: "Entry",
                isValid: isValidMoneyAmount,
                error: "- Please provide a valid Entry price (> 0.00).",
                extract: floatExtractor,
                format: pennyFormatter,
                doubleSpace: false
            },
            {
                id: "sl",
                label: "SL",
                isValid: isValidMoneyAmount,
                error: "- Please provide a valid SL price (> 0.00).",
                extract: floatExtractor,
                format: pennyFormatter,
                doubleSpace: false
            },
            {
                id: "tp",
                label: "TP",
                isValid: isValidMoneyAmount,
                error: "- Please provide a valid TP price (> 0.00).",
                extract: floatExtractor,
                format: pennyFormatter,
                doubleSpace: true
            }
        ];

        const maxInvestment = $("#maxInvestment").val();
        const maxRisk = $("#maxRisk").val();
        if (maxInvestment) {
            inputObjects.push({
                id: "maxInvestment",
                label: "Max Investment",
                isValid: isValidMoneyAmount,
                error: "- Please provide a valid Max Investment amount (> 0.00).",
                extract: floatExtractor,
                format: poundFormatter,
                doubleSpace: false
            });
            inputObjects.push({
                id: "maxRisk",
                label: "Max Risk",
                isValid: isValidPercentage,
                error: "- Please provide a valid Max Risk percentage (0.00 < amount <= 100.00) and expressed in <=2dp.",
                extract: floatExtractor,
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
        const riskPercent = (risk / entry) * 100;
        const reward = tp - entry;
        const rewardPercent = (reward / entry) * 100;
        const rMultiple = reward / risk;

        outputEntries.push(`<div class="text-danger">Risk: ${risk.money()}p (${riskPercent.money()}%)</div>`);
        outputEntries.push(`<div class="text-success">Reward: ${reward.money()}p (${rewardPercent.money()}%)</div>`);
        outputEntries.push(`<div class="text-dark double-space">RR: 1:${rMultiple.money()}</div>`);

        if (maxInvestment && maxRisk) {
            let sharesToBuy = calculateSharesToBuy(entry, sl, maxInvestment, maxRisk);
            let estimatedInvestment = calculateEstimatedInvestment(entry, sharesToBuy);
            let estimatedRisk = calculateEstimatedRisk(estimatedInvestment, riskPercent);

            outputEntries.push(`<div class="text-info ">Shares to buy: ${sharesToBuy}</div>`);
            outputEntries.push(`<div class="text-info ">Estimated Investment: ${poundFormatter(estimatedInvestment)}</div>`);
            outputEntries.push(`<div class="text-info ">Estimated Risk: ${poundFormatter(estimatedRisk)} (<= ${poundFormatter(maxRisk/100 * maxInvestment)} = ${maxRisk}% of ${poundFormatter(maxInvestment)})</div>`);
        }

        const $out = $("#out");
        $out.empty();
        $out.addClass("border border-success-subtle rounded p-3")
        outputEntries.forEach((e) => $out.append(e));
    });
    $("#clear").on("click", function () {
        $(":input").val("");
        const $out = $("#out");
        $out.empty();
        $out.removeClass("border border-success-subtle rounded p-3");
    });
});
