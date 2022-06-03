export function exportToCsv(filename, data) {
    const replacer = (key, value) => (value === null ? '' : value); // specify how you want to handle null values here
    const header = Object.keys(data[0]);
    const csv = [
        header.join(','), // header row first
        ...data.map((row) =>
            header
                .map((fieldName) =>
                    JSON.stringify(row[fieldName], replacer).replace(
                        /\\"/g,
                        '""'
                    )
                )
                .join(',')
        ),
    ].join('\r\n');

    var blob = new Blob([csv], {
        type: 'text/csv;charset=utf-8;',
    });
    if (navigator.msSaveBlob) {
        // IE 10+
        navigator.msSaveBlob(blob, filename);
    } else {
        var link = document.createElement('a');
        if (link.download !== undefined) {
            // feature detection
            // Browsers that support HTML5 download attribute
            var url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
}
