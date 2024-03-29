$(document).ready(function () {
    $("#calculate").on("click", function () {
        const $out = $("#out");
        $out.text("");

        const entry = parseFloat($("#entry").val());
        const sl = parseFloat($("#sl").val());
        const tp = parseFloat($("#tp").val());

        const risk = entry - sl;
        const reward = tp - entry;
        const rMultiple = reward / risk;

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
            `Risk: ${risk.toFixed(2)}p (${((risk / entry) * 100).toFixed(2)}%)`,
            br,
            `Reward: ${reward.toFixed(2)}p (${((reward / entry) * 100).toFixed(2)}%)`,
            br,
            br,
            `RR: 1: ${rMultiple.toFixed(2)}`
        );

        outputEntries.forEach((e) => $out.append(e));
    });
});