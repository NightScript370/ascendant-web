function getOrdinal (n, htmlSup=false) {
    return n.toString()
        + (htmlSup ? "<sup>" : "")
        + { e: "st", o: "nd", w: "rd", h: "th" }[new Intl.PluralRules("en", { type: "ordinal" }).select(n)[2]]
        + (htmlSup ? "</sup>" : "")
}