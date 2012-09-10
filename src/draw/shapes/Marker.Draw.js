L.Marker.Draw = L.Handler.Draw.extend({
	options: {
		icon: new L.Icon.Default()
	},

	addHooks: function () {
		L.Handler.Draw.prototype.addHooks.call(this);

		if (this._map) {
			this._updateLabelText({ text: 'Click map to place marker.' });
			this._map.on('mousemove', this._onMouseMove, this);
		}
	},

	removeHooks: function () {
		L.Handler.Draw.prototype.removeHooks.call(this);

		if (this._map) {
			if (this._marker) {
				this._marker.off('click', this._onClick);
				this._map
					.off('click', this._onClick)
					.removeLayer(this._marker);
				delete this._marker;
			}

			this._map.off('mousemove', this._onMouseMove);
		}
	},

	_onMouseMove: function (e) {
		var newPos = e.layerPoint,
			latlng = e.latlng;

		this._updateLabelPosition(newPos);

		if (!this._marker) {
			this._marker = new L.Marker(latlng, { icon: this.options.icon });
			// Bind to both marker and map to make sure we get the click event.
			this._marker.on('click', this._onClick, this);

            this._layerGroup = new L.layerGroup([this._marker]).addTo(this._map);
			this._map.on('click', this._onClick, this);
		}
		else {
			this._marker.setLatLng(latlng);
		}
	},

	_onClick: function (e) {
        var newMarker = new L.Marker(this._marker.getLatLng(), { icon: this.options.icon });
		this._map.fire(
			'draw:marker-created',
			{ marker: newMarker }
		);
        newMarker.on('click', function () {
            this._map.removeLayer(this._layerGroup);
            this.enable();
        }.bind(this), this);

		this.disable();
	}
});