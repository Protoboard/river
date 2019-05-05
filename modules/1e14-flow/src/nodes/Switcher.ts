import {createNode, Node} from "1e14";

export type InFields<P extends string, V> = {
  /** Value to be forwarded. */
  d_val: V;

  /** Active output. */
  st_pos: P;
};

export type OutFields<P extends string, V> = {
  /** Output positions */
  [K in P]: V;
};

export type In<P extends string, V> = InFields<P, V> & {
  /** Synchronous inputs */
  all: InFields<P, V>
};

export type Out<P extends string, V> = OutFields<P, V> & {
  /** Bounced input value */
  b_d_val: V;
};

/**
 * Forwards input value to one of the output ports, depending on the
 * node's current 'position' state.
 * Operates with either independent or joined inputs.
 */
export type Switcher<P extends string, V> = Node<In<P, V>, Out<P, V>>;

/**
 * Creates a Switcher node.
 * @param positions List of all possible positions.
 * @param position Initial 'position' state.
 */
export function createSwitcher<P extends string, V>(
  positions: Array<P>,
  position?: P
): Switcher<P, V> {
  return createNode<In<P, V> & { all: In<P, V> }, Out<P, V>>
  (positions.concat(<any>"b_d_val"), (outputs) => {
    const lookup = new Set(positions);
    return {
      all: ({d_val, st_pos}, tag) => {
        if (lookup.has(st_pos)) {
          position = st_pos;
          outputs[position](<any>d_val, tag);
        } else {
          outputs.b_d_val(d_val, tag);
        }
      },

      d_val: (value, tag) => {
        if (lookup.has(position)) {
          outputs[position](<any>value, tag);
        } else {
          outputs.b_d_val(value, tag);
        }
      },

      st_pos: (value) => {
        position = value;
      }
    };
  });
}
