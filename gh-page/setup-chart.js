async function loadData() {
    const response = await fetch('datapoints.csv');
    const text = (await response.text()).trim();

    const csvRows = text.split('\n').slice(1);

    return csvRows
        .map(csvRow => csvRow.split(','))
        .map(row => ({
            't': row[0], 'known': Number(row[1]), 'learning': Number(row[2])
        }));
}

function suggestedAxisRange(data, roundingInNths, padding) {
    return {
        'max': Math.round(Math.max(...data) / roundingInNths) * roundingInNths + padding,
        'min': Math.max(0, Math.round(Math.min(...data) / roundingInNths) * roundingInNths - padding),
    }
}

addEventListener('DOMContentLoaded', async () => {
    const dataPoints = await loadData();

    const known = dataPoints.map(d => d.known)
    const learning = dataPoints.map(d => d.learning)

    const knownAxisRange = suggestedAxisRange(known, 100, 100);
    const learningAxisRange = suggestedAxisRange(learning, 10, 10);

    const learningVocabColor = 'rgb(99,255,228)';
    const knownVocabColor = 'rgb(12,106,255)';

    const ctx = document.getElementById('chart').getContext('2d');
    const myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dataPoints.map(d => Date.parse(d.t)),
            datasets: [
                {
                    label: 'Total Known',
                    data: known,
                    borderColor: knownVocabColor,
                    borderWidth: 2,
                    backgroundColor: knownVocabColor,
                    fill: false,
                    yAxisID: 'knownVocabAxisY',
                },
                {
                    label: 'Total Learning',
                    data: learning,
                    borderColor: learningVocabColor,
                    backgroundColor: learningVocabColor,
                    borderWidth: 2,
                    fill: false,
                    yAxisID: 'learningVocabAxisY',
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Vocabulary Progress',
                    font: {
                        size: 28,
                        weight: 'bold'
                    },
                    padding: {
                        top: 20,
                        bottom: 20,
                    }
                },
                tooltip: {
                    mode: 'index',
                    footerFont: { weight: 'regular' },
                    footerAlign: 'center',
                    callbacks: {
                        footer: function (context) {
                            const total = new Intl.NumberFormat().format(context[0].raw + context[1].raw)
                            return `Total: ${total}`;
                        },
                        label: function (context) {
                            return ` ${context.dataset.label}: ${context.formattedValue}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'day',
                        tooltipFormat: 'LLL dd', // (localized long date)
                    },
                },
                knownVocabAxisY: {
                    title: {
                        display: true,
                        text: 'Total Known',
                    },
                    type: 'linear',
                    position: 'left',
                    min: knownAxisRange.min,
                    max: knownAxisRange.max,
                    grid: {
                        display: false,
                    }
                },
                learningVocabAxisY: {
                    title: {
                        display: true,
                        text: 'Total Learning',
                    },
                    type: 'linear',
                    position: 'right',
                    min: learningAxisRange.min,
                    max: learningAxisRange.max,
                }
            }
        }
    });
})
