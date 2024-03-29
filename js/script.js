$(document).ready(function () {
    $("#calculate").on("click", function () {
        const $out = $("#out");
        $out.text("");

        const entry = parseFloat($("#entry").val());
        const sl = parseFloat($("#sl").val());
        const tp = parseFloat($("#tp").val());

        const risk = entry - sl;
        const riskOut = `Risk: ${risk.toFixed(2)}p (${((risk / entry) * 100).toFixed(2)}%)`;

        const reward = tp - entry;
        const rewardOut = `Reward: ${reward.toFixed(2)}p (${((reward / entry) * 100).toFixed(2)}%)`;

        const rMultiple = reward / risk;
        const rMultipleOut = `RR: 1: ${rMultiple.toFixed(2)}`;

        const br = "<br />";
        const outputEntries = [];
        outputEntries.push(
            `Entry: ${entry}p`,
            br,
            `SL: ${sl}p`,
            br,
            `TP: ${tp}p`,
            br,
            br,
            riskOut,
            br,
            rewardOut,
            br,
            br,
            rMultipleOut
        );
        outputEntries.forEach((e) => $out.append(e));
    });
});