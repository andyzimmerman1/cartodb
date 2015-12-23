var WidgetModelFactory = require('../../src/widgets/widget-model-factory');

describe('widgets/widget-model-factory', function () {
  beforeEach(function () {
    this.factory = new WidgetModelFactory();
  });

  it('should call addType for each item', function () {
    spyOn(WidgetModelFactory.prototype, 'addType');
    var types = {
      foo: function () {},
      bar: function () {},
      baz: function () {}
    };
    new WidgetModelFactory(types); // eslint-disable-line
    expect(WidgetModelFactory.prototype.addType).toHaveBeenCalled();
    expect(WidgetModelFactory.prototype.addType.calls.count()).toEqual(3);
    expect(WidgetModelFactory.prototype.addType.calls.argsFor(0)).toEqual(['foo', jasmine.any(Function)]);
    expect(WidgetModelFactory.prototype.addType.calls.argsFor(1)).toEqual(['bar', jasmine.any(Function)]);
    expect(WidgetModelFactory.prototype.addType.calls.argsFor(2)).toEqual(['baz', jasmine.any(Function)]);
  });

  describe('.addType', function () {
    describe('when given faulty input', function () {
      it('should throw error', function () {
        expect(function () {
          this.factory.addType({
            type: 'foobar',
            createModel: true
          });
        }).toThrowError();

        // missing match
        expect(function () {
          this.factory.addType({
            type: true,
            createModel: function () {}
          });
        }).toThrowError();

        // missing create
        expect(function () {
          this.factory.addType({
            type: function () {},
            createModel: true
          });
        }).toThrowError();
      });
    });
  });

  describe('.createModel', function () {
    beforeEach(function () {
      this.attrs = {
        type: 'foobar'
      };

      this.createModelSpy = jasmine.createSpy('createModel');

      this.factory.addType('foobar', this.createModelSpy);
    });

    describe('when called with an existing type', function () {
      beforeEach(function () {
        this.returnedObj = {};
        this.createModelSpy.and.returnValue(this.returnedObj);
        this.result = this.factory.createModel(this.attrs, { 'foo': 'bar' });
      });

      it('should call create for the matching type', function () {
        expect(this.result).toBe(this.returnedObj);
      });

      it('should call createModel with given attrs', function () {
        expect(this.createModelSpy).toHaveBeenCalled();
        expect(this.createModelSpy.calls.argsFor(0).length).toEqual(2);
        expect(this.createModelSpy.calls.argsFor(0)[0]).toEqual(this.attrs);
        expect(this.createModelSpy.calls.argsFor(0)[1]).toEqual({ 'foo': 'bar' });
      });
    });

    describe('when called with non-existing type', function () {
      beforeEach(function () {
        this.attrs = {
          type: 'nope'
        };
        try {
          this.factory.createModel(this.attrs);
        } catch (e) {
          this.e = e;
        }
      });

      it('should not call create with given widget', function () {
        expect(this.createModelSpy).not.toHaveBeenCalled();
      });

      it('should throw error since no there is no matching type', function () {
        expect(this.e).toBeDefined();
      });
    });
  });
});
