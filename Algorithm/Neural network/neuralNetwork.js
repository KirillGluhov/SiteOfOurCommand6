class NeuralNetwork {
    static LEARNING_RATE = 0.5;

    constructor(num_inputs, num_hidden, num_outputs, hidden_layer_weights = null, hidden_layer_bias = null, output_layer_weights = null, output_layer_bias = null) {
        this.num_inputs = num_inputs;

        this.hidden_layer = new NeuronLayer(num_hidden, hidden_layer_bias);
        this.output_layer = new NeuronLayer(num_outputs, output_layer_bias);

        this.init_weights_from_inputs_to_hidden_layer_neurons(hidden_layer_weights);
        this.init_weights_from_hidden_layer_neurons_to_output_layer_neurons(output_layer_weights);
    }

    init_weights_from_inputs_to_hidden_layer_neurons(hidden_layer_weights) {
        let weight_num = 0;
        for (let h = 0; h < this.hidden_layer.neurons.length; h++) {
            for (let i = 0; i < this.num_inputs; i++) {
                if (!hidden_layer_weights) {
                    this.hidden_layer.neurons[h].weights.push(Math.random());
                } else {
                    this.hidden_layer.neurons[h].weights.push(hidden_layer_weights[weight_num]);
                }
                weight_num++;
            }
        }
    }

    init_weights_from_hidden_layer_neurons_to_output_layer_neurons(output_layer_weights) {
        let weight_num = 0;
        for (let o = 0; o < this.output_layer.neurons.length; o++) {
            for (let h = 0; h < this.hidden_layer.neurons.length; h++) {
                if (!output_layer_weights) {
                    this.output_layer.neurons[o].weights.push(Math.random());
                } else {
                    this.output_layer.neurons[o].weights.push(output_layer_weights[weight_num]);
                }
                weight_num++;
            }
        }
    }

    inspect() {
        console.log('------');
        console.log(`* Inputs: ${this.num_inputs}`);
        console.log('------');
        console.log('Hidden Layer');
        this.hidden_layer.inspect();
        console.log('------');
        console.log('* Output Layer');
        this.output_layer.inspect();
        console.log('------');
    }

    feed_forward(inputs) {
        const hidden_layer_outputs = this.hidden_layer.feed_forward(inputs);
        return this.output_layer.feed_forward(hidden_layer_outputs);
    }

    train(training_inputs, training_outputs) {
        this.feed_forward(training_inputs);

        const pd_errors_wrt_output_neuron_total_net_input = Array(this.output_layer.neurons.length).fill(0);
        for (let o = 0; o < this.output_layer.neurons.length; o++) {
            pd_errors_wrt_output_neuron_total_net_input[o] = this.output_layer.neurons[o]
                .calculate_pd_error_wrt_total_net_input(training_outputs[o]);
        }

        const pd_errors_wrt_hidden_neuron_total_net_input = Array(this.hidden_layer.neurons.length).fill(0);
        for (let h = 0; h < this.hidden_layer.neurons.length; h++) {
            let d_error_wrt_hidden_neuron_output = 0;
            for (let o = 0; o < this.output_layer.neurons.length; o++) {
                d_error_wrt_hidden_neuron_output += pd_errors_wrt_output_neuron_total_net_input[o] * this.output_layer
                    .neurons[o].weights[h];
            }
            pd_errors_wrt_hidden_neuron_total_net_input[h] = d_error_wrt_hidden_neuron_output * this.hidden_layer
                .neurons[h].calculate_pd_total_net_input_wrt_input();
        }

        for (let o = 0; o < this.output_layer.neurons.length; o++) {
            for (let w_ho = 0; w_ho < this.output_layer.neurons[o].weights.length; w_ho++) {
                let pd_error_wrt_weight = pd_errors_wrt_output_neuron_total_net_input[o] * this.output_layer.neurons[o].calculate_pd_total_net_input_wrt_weight(w_ho);
                this.output_layer.neurons[o].weights[w_ho] -= this.LEARNING_RATE * pd_error_wrt_weight;
            }
        }

        for (let h = 0; h < this.hidden_layer.neurons.length; h++) {
            for (let w_ih = 0; w_ih < this.hidden_layer.neurons[h].weights.length; w_ih++) {
                let pd_error_wrt_weight = pd_errors_wrt_hidden_neuron_total_net_input[h] * this.hidden_layer.neurons[h].calculate_pd_total_net_input_wrt_weight(w_ih);
                this.hidden_layer.neurons[h].weights[w_ih] -= this.LEARNING_RATE * pd_error_wrt_weight;
            }
        }
    }

    calculate_total_error(training_sets) {
        let total_error = 0;
        for (let t = 0; t < training_sets.length; t++) {
            const [training_inputs, training_outputs] = training_sets[t];
            this.feed_forward(training_inputs);
            for (let o = 0; o < training_outputs.length; o++) {
                total_error += this.output_layer.neurons[o].calculate_error(training_outputs[o]);
            }
        }
        return total_error;
    }

    predict(input, neuralNetwork) {
    let output = input;
    for (let i = 1; i < neuralNetwork.layers.length; i++) {
        const layer = neuralNetwork.layers[i];
        const nextOutput = new Array(layer.size).fill(0);
        for (let j = 1; j < neuralNetwork.sizes[i]; j++) {
            let sum = 0;
            for (let k = 0; k < output.length; k++) {
                sum += output[k] * layer.weights[j][k];
            }
            nextOutput[j] = 1 / (1 + Math.exp(-sum));
        }
        output = nextOutput;
    }
    return output;
}

    runNet(input, neuralNetwork) {
        let output = input;
        for (let i = 1; i < neuralNetwork.layers.length; i++) {
            const layer = neuralNetwork.layers[i];
            let nextOutput = []; 
            for (let c = 0; c < layer.size; c++) {
                nextOutput.push(0);
            }
            for (let j = 1; j < neuralNetwork.sizes[i]; j++) {
                let sum = 0;
                for (let k = 0; k < output.length; k++) {
                    sum += output[k] * layer.weights[j][k];
                }
                nextOutput[j] = neuralNetwork.activation(sum + layer.biases[j]);
            }
            output = nextOutput;
        }
        const outputLayer = neuralNetwork.outputLookup;
        const nextOutput = [0,0,0,0,0,0,0,0,0,0];
        for (let j = 0; j < outputLayer.size; j++) {
            let sum = 0;
            for (let k = 0; k < output.length; k++) {
                sum += output[k] * outputLayer.weights[j][k];
            }
            nextOutput[j] = neuralNetwork.activation(sum + outputLayer.biases[j]);
        }
        return nextOutput;
    }





    }


class NeuronLayer {
    constructor(num_neurons, bias) {
        this.bias = bias || Math.random();
        this.neurons = [];
        for (let i = 0; i < num_neurons; i++) {
            this.neurons.push(new Neuron(this.bias));
        }
    }

    inspect() {
        console.log('Neurons:', this.neurons.length);
        for (let n = 0; n < this.neurons.length; n++) {
            console.log(' Neuron', n);
            for (let w = 0; w < this.neurons[n].weights.length; w++) {
                console.log('  Weight:', this.neurons[n].weights[w]);
            }
            console.log('  Bias:', this.bias);
        }
    }

    feed_forward(inputs) {
    var outputs = [];
    for (var i = 0; i < this.neurons.length; i++) {
        var neuron = this.neurons[i];
        outputs.push(neuron.calculate_output(inputs));
    }
    return outputs;
    }


    get_outputs() {
    var outputs = [];
    for (var i = 0; i < this.neurons.length; i++) {
        var neuron = this.neurons[i];
        outputs.push(neuron.output);
    }
    return outputs;
    } 

}


class Neuron {
    constructor(bias) {
        this.bias = bias;
        this.weights = [];
    }

    calculate_output(inputs) {
        this.inputs = inputs;
        this.output = this.squash(this.calculate_total_net_input());
        return this.output;
    }

    calculate_total_net_input() {
        let total = 0;
        for (let i = 0; i < this.inputs.length; i++) {
            total += this.inputs[i] * this.weights[i];
        }
        return total + this.bias;
    }

    squash(totalNetInput) {
        return 1 / (1 + Math.exp(-totalNetInput));
    }

    calculate_pd_error_wrt_total_net_input(targetOutput) {
        return (
            this.calculate_pd_error_wrt_output(targetOutput) *
            this.calculate_pd_total_net_input_wrt_input()
        );
    }

    calculate_error(targetOutput) {
        return 0.5 * Math.pow(targetOutput - this.output, 2);
    }

    calculate_pd_error_wrt_output(targetOutput) {
        return -(targetOutput - this.output);
    }

    calculate_pd_total_net_input_wrt_input() {
        return this.output * (1 - this.output);
    }

    calculate_pd_total_net_input_wrt_weight(index) {
        return this.inputs[index];
    }
}

