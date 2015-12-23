var cdb = require('cartodb.js');
var Backbone = require('backbone');
var PublicDashboardConfig = require('../../src/windshaft/public-dashboard-config');
var HistogramDataviewModel = require('../../src/dataviews/histogram-dataview-model');

describe('windshaft/public-dashboard-config', function () {
  beforeEach(function () {
    this.dataviews = new Backbone.Collection();

    this.cartoDBLayer1 = new cdb.geo.CartoDBLayer({
      id: 'layer1',
      sql: 'sql1',
      cartocss: 'cartoCSS1',
      cartocss_version: '2.0'
    });
    var dataview = new HistogramDataviewModel({
      id: 'dataviewId',
      column: 'column1',
      bins: 10
    }, {
      layer: this.cartoDBLayer1
    });
    this.dataviews.add(dataview);

    this.cartoDBLayer2 = new cdb.geo.CartoDBLayer({
      id: 'layer2',
      sql: 'sql2',
      cartocss: 'cartoCSS2',
      cartocss_version: '2.0'
    });
    var dataview2 = new HistogramDataviewModel({
      id: 'dataviewId2',
      column: 'column2',
      bins: 5
    }, {
      layer: this.cartoDBLayer2
    });
    this.dataviews.add(dataview2);
  });

  describe('.generate', function () {
    it('should generate the config', function () {
      var config = PublicDashboardConfig.generate({
        dataviews: this.dataviews,
        layers: [ this.cartoDBLayer1, this.cartoDBLayer2 ]
      });

      expect(config).toEqual({
        layers: [
          {
            type: 'cartodb',
            options: {
              sql: 'sql1',
              cartocss: 'cartoCSS1',
              cartocss_version: '2.0',
              interactivity: [ 'cartodb_id' ],
              widgets: {
                dataviewId: {
                  type: 'histogram',
                  options: {
                    column: 'column1',
                    bins: 10
                  }
                }
              }
            }
          },
          {
            type: 'cartodb',
            options: {
              sql: 'sql2',
              cartocss: 'cartoCSS2',
              cartocss_version: '2.0',
              interactivity: [ 'cartodb_id' ],
              widgets: {
                dataviewId2: {
                  type: 'histogram',
                  options: {
                    column: 'column2',
                    bins: 5
                  }
                }
              }
            }
          }
        ]
      });
    });

    it('should not include hidden layers', function () {
      this.cartoDBLayer1.set('visible', false);

      var config = PublicDashboardConfig.generate({
        dataviews: this.dataviews,
        layers: [ this.cartoDBLayer1, this.cartoDBLayer2 ]
      });

      expect(config).toEqual({
        layers: [
          {
            type: 'cartodb',
            options: {
              sql: 'sql2',
              cartocss: 'cartoCSS2',
              cartocss_version: '2.0',
              interactivity: [ 'cartodb_id' ],
              widgets: {
                dataviewId2: {
                  type: 'histogram',
                  options: {
                    column: 'column2',
                    bins: 5
                  }
                }
              }
            }
          }
        ]
      });
    });
  });
});
