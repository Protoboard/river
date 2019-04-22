import {connect} from "1e14";
import {createReducer, Reducer} from "./Reducer";

describe("createReducer()", () => {
  describe("when initialized", () => {
    describe("on input (all)", () => {
      let node: Reducer<number, number>;

      beforeEach(() => {
        node = createReducer((curr, next) => curr + next, 0);
      });

      describe("when a_res is true", () => {
        beforeEach(() => {
          node.i.all({d_val: 5, a_res: false}, "1");
          node.i.all({d_val: 3, a_res: false}, "2");
        });

        it("should emit on d_val", () => {
          const spy = jasmine.createSpy();
          connect(node.o.d_val, spy);
          node.i.all({d_val: 4, a_res: true}, "3");
          expect(spy).toHaveBeenCalledWith(12, "3");
        });
      });
    });

    describe("on input (a_res)", () => {
      let node: Reducer<number, number>;

      beforeEach(() => {
        node = createReducer((curr, next) => curr + next, 0);
      });

      describe("when truthy", () => {
        beforeEach(() => {
          node.i.a_res(false, "1");
          node.i.d_val(5, "2");
          node.i.d_val(3, "3");
        });

        it("should emit on d_val", () => {
          const spy = jasmine.createSpy();
          connect(node.o.d_val, spy);
          node.i.a_res(true, "4");
          expect(spy).toHaveBeenCalledWith(8, "4");
        });
      });

      describe("when falsy", () => {
        beforeEach(() => {
          node.i.a_res(false, "1");
          node.i.d_val(5, "2");
          node.i.d_val(3, "3");
        });

        it("should not emit on d_val", () => {
          const spy = jasmine.createSpy();
          connect(node.o.d_val, spy);
          node.i.a_res(false, "4");
          expect(spy).not.toHaveBeenCalled();
        });
      });
    });
  });

  describe("when uninitialized", () => {
    describe("on input (all)", () => {
      let node: Reducer<number, number>;

      beforeEach(() => {
        node = createReducer((curr, next) => curr + next);
      });

      describe("for first", () => {
        describe("when a_res is true", () => {
          it("should emit on d_val", () => {
            const spy = jasmine.createSpy();
            connect(node.o.d_val, spy);
            node.i.all({d_val: 5, a_res: true}, "3");
            expect(spy).toHaveBeenCalledWith(5, "3");
          });
        });
      });

      describe("for rest", () => {
        describe("when a_res is true", () => {
          beforeEach(() => {
            node.i.all({d_val: 5, a_res: false}, "1");
            node.i.all({d_val: 3, a_res: false}, "2");
          });

          it("should emit on d_val", () => {
            const spy = jasmine.createSpy();
            connect(node.o.d_val, spy);
            node.i.all({d_val: 4, a_res: true}, "3");
            expect(spy).toHaveBeenCalledWith(12, "3");
          });
        });
      });
    });

    describe("on input (a_res)", () => {
      let node: Reducer<number, number>;

      beforeEach(() => {
        node = createReducer((curr, next) => curr + next);
      });

      describe("when truthy", () => {
        beforeEach(() => {
          node.i.a_res(false, "1");
          node.i.d_val(5, "2");
          node.i.d_val(3, "3");
        });

        it("should emit on d_val", () => {
          const spy = jasmine.createSpy();
          connect(node.o.d_val, spy);
          node.i.a_res(true, "4");
          expect(spy).toHaveBeenCalledWith(8, "4");
        });
      });

      describe("when falsy", () => {
        beforeEach(() => {
          node.i.a_res(false, "1");
          node.i.d_val(5, "2");
          node.i.d_val(3, "3");
        });

        it("should not emit on d_val", () => {
          const spy = jasmine.createSpy();
          connect(node.o.d_val, spy);
          node.i.a_res(false, "4");
          expect(spy).not.toHaveBeenCalled();
        });
      });
    });
  });
});
