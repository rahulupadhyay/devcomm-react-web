export const csvToJSON = (csvStringData) => {
    // console.log(csvStringData);
    if (csvStringData === null) {
        return ["Yet to add!"]
    }

    let result = [];

    let headers = csvStringData.split(",");

    for (let i = 1; i < headers.length; i++) {
        result.push(headers[i].trim());
    }

    return result; //JavaScript object
};