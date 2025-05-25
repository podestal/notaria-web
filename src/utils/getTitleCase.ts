const getTitleCase = (str: string) => {
    return str.toLowerCase().split(' ').map(function(word: string) {
        return word.charAt(0).toUpperCase() + word.slice(1);
    }).join(' ')
}

export default getTitleCase