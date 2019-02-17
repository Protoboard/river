import {TInPort, TOutPort, TOutPorts, TTag} from "../types";

/**
 * Creates output ports for the specified fields.
 * @param fields List of fields.
 */
export function createOutPorts<O>(fields: Array<keyof O>): TOutPorts<O> {
  const outPorts = <TOutPorts<O>>{};
  for (const field of fields) {
    outPorts[field] = new Set();
  }
  return outPorts;
}

export type TOutput<V> = (value: V, tag?: TTag) => void;
export type TOutputs<O> = {
  [K in keyof O]: TOutput<O[K]>
};

/**
 * Creates output callbacks for the specified output ports.
 * The result is used in implementing atomic nodes.
 * @param outPorts List of output callbacks.
 */
export function createOutputs<O>(outPorts: TOutPorts<O>): TOutputs<O> {
  const outputs = <TOutputs<O>>{};
  for (const field in outPorts) {
    const inPorts = outPorts[field];
    outputs[field] = (value, tag) => {
      for (const inPort of inPorts) {
        inPort(value, tag);
      }
    };
  }
  return outputs;
}

export const noop = () => null;

/**
 * Establishes a connection between an output port and an input port. Data
 * emitted on an output port are automatically forwarded to connected input
 * ports.
 * @param outPort
 * @param inPort
 */
export function connect<V>(outPort: TOutPort<V>, inPort: TInPort<V>): void {
  outPort.add(inPort);
}

/**
 * Tears down the connection between the specified ports, or, when the input
 * port is omitted, tears down all downstream connections of the output port.
 * @param outPort
 * @param inPort
 */
export function disconnect<V>(outPort: TOutPort<V>, inPort?: TInPort<V>): void {
  if (inPort) {
    outPort.delete(inPort);
  } else {
    outPort.clear();
  }
}
