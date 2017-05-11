import { Matrix } from "./matrix";
import { RNN } from "./rnn";
import { Tracer } from "./tracer";

// Test Matrix
((skip?: any) => {
    if (skip) return;

    let x: Matrix = new Matrix([[1, 0], [3, 4]]);
    let y: Matrix = new Matrix([[5, 6], [7, 8]]);

    console.log(x.add(y));
    console.log(x.subtract(y));
    console.log(x.multiply(y));
    console.log(x.matmul(y));
    console.log(y.transpose());
    console.log(Matrix.argmax(x, 0));
    console.log(Matrix.argmax(x, 1));

})(1);

// RNN
((skip?: any) => {
    if (skip) return;

    let input_dim = 10;
    let hidden_dim = 10;
    let output_dim = 10;
    let series_len = 100;

    function series_start_at(series_len: number, input_dim: number, n: number): Matrix {
        let ret = Matrix.zeros([series_len, input_dim]);
        for (let i = 0; i < series_len; ++i) {
            ret.set(i, (i + n) % 10, 1);
        }
        return ret;
    }

    let inputs_series = series_start_at(series_len, input_dim, 0);
    let targets_series = series_start_at(series_len, input_dim, 3);
    let test_inputs_series = series_start_at(series_len, input_dim, 5);

    let rnn = new RNN(series_len, input_dim, hidden_dim, output_dim);
    console.log("\ntraining");
    for (let i = 0; i < 100; ++i) {
        console.log(rnn.train(
            inputs_series,
            targets_series,
            1e-3
        ));
    }
    console.log("\npredicting");
    let outputs_series = rnn.predict(test_inputs_series);
    console.log(Matrix.argmax(test_inputs_series, 1).content.join(', '));
    console.log(Matrix.argmax(outputs_series, 1).content.join(', '));
})(1);

// RNN
((skip?: any) => {
    if (skip) return;

    let input_dim = 10;
    let hidden_dim = 20;
    let output_dim = 10;
    let series_len = 1000;

    function series_start_at(series_len: number, input_dim: number, n: number): number[][] {
        let ret = Matrix.fillArray2D([series_len, input_dim]);
        for (let i = 0; i < series_len; ++i) {
            ret[i][(i + n) % 10] = 1;
        }
        return ret;
    }

    let inputs_series = series_start_at(series_len, input_dim, 0);
    let targets_series = series_start_at(series_len, input_dim, 3);
    let test_inputs_series = series_start_at(series_len, input_dim, 5);

    let tracer = new Tracer(20, input_dim, hidden_dim, output_dim);

    for (let epoch = 0; epoch < 1; ++epoch)
        for (let i = 0; i < series_len; ++i) {
            tracer.tick(inputs_series[i], targets_series[i], 1e-2);
        }

    function argmax(arr: number[]) {
        let ret = 0;
        for (let i = 0; i < arr.length; ++i) {
            ret = arr[i] > arr[ret] ? i : ret;
        }
        return ret;
    }

    for (let i = 0; i < series_len; ++i) {
        console.log(argmax(tracer.tick(inputs_series[i])));
    }
})();