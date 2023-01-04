module.exports = {
    presets: ['@vue/app'],
    plugins: [
        ["import", {
            "libraryName": "ivew",
            "libraryDirectory": "es2015",
            "style": true
        }],
        ['import', {
            libraryName: 'vant',
            libraryDirectory: 'es',
            style: true
          }, 'vant']
    ]
}