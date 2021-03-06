(function($) {
	$.fn.barChooseGraph = function(type, categories, min, max)
	{
console.log(max);
		if(type == "init")
		{
			var nc = categories.length;
			var w = this.width();
			var cw = (100 / nc) + "%";
			var h = this.height();
			var root = this;

			var bgm = document.createElement("DIV");
			$(bgm).addClass("bar-graph-main");
			root.append(bgm);

			var bgg = document.createElement("DIV");
			$(bgg).addClass("bar-graph-graph");
			$(bgm).append(bgg);

			var bgmr = document.createElement("DIV");
                        $(bgmr).addClass("bar-graph-main-remaining");
                        $(bgmr).html("You have <span>" + max + "</span> tickets left to distribute");
                        $(bgg).append(bgmr);

			/*var bgcsw = document.createElement("DIV");
			$(bgcsw).addClass("bar-graph-columns-wrap");
			$(bgg).append(bgcsw);*/

			var bgcs = document.createElement("DIV");
			$(bgcs).addClass("bar-graph-columns");
			$(bgg).append(bgcs);

			var bgls = document.createElement("DIV");
			$(bgls).addClass("bar-graph-labels");
			$(bgg).append(bgls);

			var bglps = document.createElement("DIV");
			$(bglps).addClass("bar-graph-labels-texts");
			$(bgls).append(bglps);

			var bglis = document.createElement("DIV");
			$(bglis).addClass("bar-graph-labels-inputs");
			$(bgls).append(bglis);

			for(var i = 0; i < nc; i++)
			{
				var bgcw = document.createElement("DIV");
				$(bgcw).addClass("bar-graph-column-wrap");
				bgcw.id = "cwcat" + i;
				$(bgcs).append(bgcw);

				var bgc = document.createElement("DIV");
				$(bgc).addClass("bar-graph-column");
				$(bgcw).append(bgc);
				bgc.id = "ccat" + i;
				bgc.value = min;

				var bgli = document.createElement("DIV");
				$(bgli).addClass("bar-graph-input");
				bgli.style.width = cw;
				$(bgli).append("<input type='text' value='" + min + "' id='icat" + i + "'></input>");
				$(bglis).append(bgli);

				var bglp = document.createElement("P");
				bglp.style.width = cw;
				bglp.innerHTML = categories[i];
			 	$(bglps).append(bglp);
			}

			var remaining = max;

			function checkRest()
			{
				remaining = max;
				$(root).find(".bar-graph-input input").each(function() {
					remaining -= parseInt(this.value);
				});

				$(bgmr).find("span").html(remaining);
			}

			window.setTimeout(function() {
				$(root).find(".bar-graph-column").each(function() {
					var bgc = this;

					$(bgc).on("mousedown", function (e)
					{
                                        	var sh = $(bgc).height();
                                        	var sy = e.pageY;
						var maxh = bgc.parentNode.clientHeight;
						var minh = 15;

                                        	$(document).on("mouseup", function(me) {
                                                	$(document).off("mouseup").off("mousemove");
                                        	});

                                        	$(document).on("mousemove", function(me) {
							var cat = bgc.id.substr(4, bgc.id.length - 4);
                                                	var my = (me.pageY - sy);
							var input = $(root).find("#icat" + cat)[0];

							var v = parseInt((max - min) * (sh - my) / maxh + min).clamp(min, max);
							var pv = parseInt(input.value);
							console.log(v + " " + (pv + remaining));
							if(v >= (pv + remaining)) {
								v = pv + remaining;

								//$(bgmr).find("span").addClass("highlight");
								//window.setTimeout(function() { $(bgmr).find("span").removeClass("hightlight"); }, 100);
							}

							$(bgc).css("height", ((maxh - minh) * (v - min) / (max - min) + minh) + "px");
							bgc.value = v;
							input.value = v;
							checkRest();
                                        	});
					});
                                });

				$(root).find(".bar-graph-input input").each(function() {
					var self = this;
					$(this).change(function() {
						var cat = self.id.substr(4, self.id.length - 4);
						var bar = $(root).find("#ccat" + cat)[0];

						var v = (parseInt(self.value) || min).clamp(min, max);
						var pv = parseInt(bar.value);
						if(v >= (pv + remaining)) {
                                                	v  = pv + remaining;

                                                        //$(bgmr).find("span").addClass("highlight");
                                                        //window.setTimeout(function() { $(bgmr).find("span").removeClass("hightlight"); }, 100);
                                                }

						var maxh = bar.parentNode.clientHeight;
						var minh = 15;

						bar.style.height = ((maxh - minh) * (v - min) / (max - min) + minh) + "px";
						bar.value = v;
						self.value = v;
						checkRest();
					});
					$(this).focus(function() {
						self.select();
					});
				});
			}, 100);
		}
		else if(type == "get")
		{
			var vals = $(this).find(".bar-graph-input input");
			var cats = $(this).find(".bar-graph-labels-texts p");
			var data = [];

			for(var i = 0; i < vals.length && i < cats.length; i++)
				data.push([ parseInt(vals[i].value), cats[i].innerHTML ]);

			return data;
		}

		return this;
	};
}(jQuery));
