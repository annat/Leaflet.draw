L.Marker.Draw = L.Handler.Draw.extend({
	options : {
		icon : new L.Icon.Default()
	},

	addHooks : function() {
		L.Handler.Draw.prototype.addHooks.call(this);

		if (this._map) {
			this._updateLabelText({
				text : 'Click map to place marker.'
			});
			this._map.on('mousemove', this._onMouseMove, this);

		}
	},

	removeHooks : function() {
		L.Handler.Draw.prototype.removeHooks.call(this);

		if (this._map) {
			if (this._marker) {
				this._marker.off('click', this._onMapClick);
				this._map.off('click', this._onMapClick).removeLayer(this._marker);
				delete this._marker;
			}

			this._map.off('mousemove', this._onMouseMove);
		}
	},

	_onMapClick : function(e) { {
			this._map.fire('draw:marker-created', {
				marker : new L.Marker(this._marker.getLatLng(), {
					draggable : true
				}, {
					icon : this.options.icon
				})

			}).addTo(map);
			this.disable();
		}

	},

	_onMouseMove : function(e) {
		var newPos = e.layerPoint, latlng = e.latlng;

		this._updateLabelPosition(newPos);

		if (!this._marker) {
			this._marker = new L.Marker(latlng, {
				icon : this.options.icon
			});
			
			var time;
			var sTime;
			this._map.on('mousedown', function() {
				time = Date.now();
				clearTimeout(sTime);
				sTime = setTimeout(this._onMapClick.bind(this), 1000);

			}, this);

			this._map.on('mouseup', function() {

				if (time + 1000 > Date.now()) {

					clearTimeout(sTime);
				}

			}, this);

			// Bind to both marker and map to make sure we get the click event.

			//this._marker.on('click', this._onClick, this);
			//this._map.on('click', this._onClick, this).on('drag', onDragging).addLayer(this._marker);
		} else {
			this._marker.setLatLng(latlng);
		}
	},

	_timer : function() {
		var d = new Date();
		var s = d.toLocaleTimeString();
		return s;

	},
	_onClick : function(e) {
		this._map.fire('draw:marker-created', {
			marker : new L.Marker(this._marker.getLatLng(), {
				draggable : true
			}, {
				icon : this.options.icon
			})

		});
		this.disable();
	}
});
