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
                error: "- Please provide a valid Max Investment amount (> 0.00) and expressed in <=2dp.",
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
            $('#errorOut').empty();
            Object.values(validationErrors).forEach((error) => {
                const errorElement = $('<p>').addClass('text-danger m-1').text(error);
                $('#errorOut').append(errorElement);
            });

            $('#errorOutputModal').modal('show');
            return;
        }

        const outputEntries = inputObjects.map(({label, format, doubleSpace}, index) => {
            const value = format(inputValues[index]);
            const spacing = doubleSpace ? ' double-space-after' : '';
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
        let rMultipleColor = rMultiple < 1 ? 'text-danger' : 'text-dark';
        outputEntries.push(`<div class="${rMultipleColor}"><strong>RR: 1:${rMultiple.money()}</strong></div>`);

        if (maxInvestment && maxRisk) {
            let sharesToBuy = calculateSharesToBuy(entry, sl, maxInvestment, maxRisk);
            let estimatedInvestment = calculateEstimatedInvestment(entry, sharesToBuy);
            let estimatedRisk = calculateInvestmentChange(estimatedInvestment, riskPercent);
            let estimatedReward = calculateInvestmentChange(estimatedInvestment, rewardPercent);

            outputEntries.push(`
           <div class="border border-success-subtle rounded p-3 double-space-before">
           <div class="text-info"><i>Shares to buy: ${sharesToBuy}</i></div>
           <div class="text-info"><i>Estimated Investment: ${poundFormatter(estimatedInvestment)}</i></div>
           <div class="text-info"><i>Estimated Risk: <span class="text-danger">${poundFormatter(estimatedRisk)}</span> (<= ${poundFormatter(maxRisk / 100 * maxInvestment)} i.e. ${maxRisk}% of ${poundFormatter(maxInvestment)})</i></div>
           <div class="text-info"><i>Estimated Reward: <span class="text-success">${poundFormatter(estimatedReward)}</span> (${percentageFormatter(rewardPercent)} of ${poundFormatter(estimatedInvestment)})</i></div>
           </div>
           `);
        }

        const $out = $("#out");
        $out.empty();
        $out.addClass("border border-success-subtle rounded p-3")
        outputEntries.forEach((e) => $out.append(e));

        $("#copyBtn").removeClass("visually-hidden");
        $("#copyBtn").tooltip('dispose');
    });

    $('[data-bs-toggle="tooltip"]').tooltip()

    $('input').click(function () {
        this.select();
    });

    $("#clear").on("click", function () {
        $(":input").val("");
        const $out = $("#out");
        $out.empty();
        $out.removeClass("border border-success-subtle rounded p-3");
        $("#copyBtn").addClass("visually-hidden");
        $("#copyBtn").tooltip('dispose');
    });

    $("#copyBtn").on("click", function () {
        const copiedText = extractText(document.getElementById("out"));

        // Copy the text to the clipboard
        navigator.clipboard.writeText(copiedText).then(function () {
            // Show tooltip indicating successful copy
            $("#copyBtn").tooltip('dispose');
            $("#copyBtn").tooltip({
                title: "Copied to clipboard",
                placement: "top"
            });
            $("#copyBtn").tooltip('show');
            setTimeout(function () {
                $("#copyBtn").tooltip('hide');
            }, 2000);
        }, function (err) {
            // Show error message in modal
            $("#copyErrorModalBody").text("Error copying text: " + err);
            $("#copyErrorModal").modal('show');
        });
    });

    // $("#copyBtn").on("click", function () {
    //     const copiedText = extractText(document.getElementById("out"));
    //
    //     // Simulate an error by rejecting the clipboard write promise
    //     const error = new Error("Simulated copy error");
    //     Promise.reject(error).then(function() {
    //         // This block will not be executed because of the rejection
    //     }, function(err) {
    //         // Show error message in modal
    //         $("#copyErrorModalBody").text("Error copying text: " + err.message);
    //         $("#copyErrorModal").modal('show');
    //     });
    // });

    function extractText(node) {
        let result = "";

        Array.from(node.children).forEach((child) => {
            if (child.className.toLowerCase().includes("text-")) {
                if (child.className.toLowerCase().includes("double-space-before")) {
                    result += "\n";
                }
                result += child.textContent + "\n";
                if (child.className.toLowerCase().includes("double-space-after")) {
                    result += "\n";
                }
            } else {
                result += "\n";
                Array.from(child.children).forEach((grandChild) => {
                    result += grandChild.textContent + "\n";
                });
            }
        });

        return result;
    }

});
