class Target extends Component {
    constructor(options) {
        super(options);

        function shotHandler() {
            var x = document.getElementById('x').value
            var y = document.getElementById('y').value
            var result = shotToTarget(x, y);
            document
                .getElementById('result')
                .innerHTML = 'Количество очков: '
                + result;
        }

        var button = document.getElementById('pressMe')
        button.addEventListener('click', shotHandler);

        document.getElementById('clear')
            .addEventListener('click', clearHandler)


        function clearHandler() {
            points = 0;
            document
                .getElementById('points')
                .innerHTML = 'Количество очков: 0'
        }
    }
}