
export const getRelativeTimeString = (date?: Date, lang = 'es') => {
    if (date === undefined) return ''
    const timeMs = date.getTime()
    const deltaSeconds = Math.round((timeMs - Date.now()) / 1000)
    const cutoffs = [
        60,
        60 * 60,
        60 * 60 * 24,
        60 * 60 * 24 * 7,
        60 * 60 * 24 * 30,
        60 * 60 * 24 * 365,
        Infinity,
    ]
    const units: Intl.RelativeTimeFormatUnit[] = [
        'second',
        'minute',
        'hour',
        'day',
        'week',
        'month',
        'year',
    ]
    const index = cutoffs.findIndex(cutoff => cutoff > Math.abs(deltaSeconds))
    const divisor = index ? cutoffs[index - 1] : 1
    return new Intl.RelativeTimeFormat(lang, {numeric: 'auto'})
        .format(Math.floor(deltaSeconds / (divisor || 1)), units[index] || 'second')
}