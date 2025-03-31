async function loadData() {
    const response = await fetch('datapoints.txt');
    const text = (await response.text()).trim();

    return JSON.parse('[' + text.split('\n').join(',') + ']');
}

function suggestedAxisRange(data, padding, roundingInNths) {
    return {
        'max': Math.round(Math.max(...data) * (1 + padding) / roundingInNths) * roundingInNths,
        'min': Math.round(Math.min(...data) * (1 - padding) / roundingInNths) * roundingInNths,
    }
}

addEventListener('DOMContentLoaded', async () => {
    const datapoints = await loadData();

    const known = datapoints.map(d => d.status.known)
    const learning = datapoints.map(d => d.status.learning)

    const knownAxisRange = suggestedAxisRange(known, 0.1, 100);
    const learningAxisRange = suggestedAxisRange(learning, 0.1, 10);

    const learningVocabColor = 'rgb(99,255,228)';
    const knownVocabColor = 'rgb(12,106,255)';

    const ctx = document.getElementById('chart').getContext('2d');
    const myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: datapoints.map(d => Date.parse(d.t)),
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
            responsive: false,
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
