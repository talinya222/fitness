(() => {
	"use strict";
	const t = {};
	let e = {
		Android: function () {
			return navigator.userAgent.match(/Android/i);
		},
		BlackBerry: function () {
			return navigator.userAgent.match(/BlackBerry/i);
		},
		iOS: function () {
			return navigator.userAgent.match(/iPhone|iPad|iPod/i);
		},
		Opera: function () {
			return navigator.userAgent.match(/Opera Mini/i);
		},
		Windows: function () {
			return navigator.userAgent.match(/IEMobile/i);
		},
		any: function () {
			return (
				e.Android() || e.BlackBerry() || e.iOS() || e.Opera() || e.Windows()
			);
		},
	};
	function n() {
		if (location.hash) return location.hash.replace("#", "");
	}
	let i = !0,
		s = (t = 500) => {
			document.documentElement.classList.contains("lock") ? r(t) : a(t);
		},
		r = (t = 500) => {
			let e = document.querySelector("body");
			if (i) {
				let n = document.querySelectorAll("[data-lp]");
				setTimeout(() => {
					for (let t = 0; t < n.length; t++) {
						n[t].style.paddingRight = "0px";
					}
					(e.style.paddingRight = "0px"),
						document.documentElement.classList.remove("lock");
				}, t),
					(i = !1),
					setTimeout(function () {
						i = !0;
					}, t);
			}
		},
		a = (t = 500) => {
			let e = document.querySelector("body");
			if (i) {
				let n = document.querySelectorAll("[data-lp]");
				for (let t = 0; t < n.length; t++) {
					n[t].style.paddingRight =
						window.innerWidth -
						document.querySelector(".wrapper").offsetWidth +
						"px";
				}
				(e.style.paddingRight =
					window.innerWidth -
					document.querySelector(".wrapper").offsetWidth +
					"px"),
					document.documentElement.classList.add("lock"),
					(i = !1),
					setTimeout(function () {
						i = !0;
					}, t);
			}
		};
	function u(t) {
		setTimeout(() => {
			window.FLS && console.log(t);
		}, 0);
	}
	function o(t) {
		return t.filter(function (t, e, n) {
			return n.indexOf(t) === e;
		});
	}
	t.popup = new (class {
		constructor(t) {
			let e = {
				logging: !0,
				init: !0,
				attributeOpenButton: "data-popup",
				attributeCloseButton: "data-close",
				fixElementSelector: "[data-lp]",
				youtubeAttribute: "data-youtube",
				youtubePlaceAttribute: "data-youtube-place",
				setAutoplayYoutube: !0,
				classes: {
					popup: "popup",
					popupContent: "popup__content",
					popupActive: "popup_show",
					bodyActive: "popup-show",
				},
				focusCatch: !0,
				closeEsc: !0,
				bodyLock: !0,
				bodyLockDelay: 500,
				hashSettings: { location: !0, goHash: !0 },
				on: {
					beforeOpen: function () { },
					afterOpen: function () { },
					beforeClose: function () { },
					afterClose: function () { },
				},
			};
			(this.isOpen = !1),
				(this.targetOpen = { selector: !1, element: !1 }),
				(this.previousOpen = { selector: !1, element: !1 }),
				(this.lastClosed = { selector: !1, element: !1 }),
				(this._dataValue = !1),
				(this.hash = !1),
				(this._reopen = !1),
				(this._selectorOpen = !1),
				(this.lastFocusEl = !1),
				(this._focusEl = [
					"a[href]",
					'input:not([disabled]):not([type="hidden"]):not([aria-hidden])',
					"button:not([disabled]):not([aria-hidden])",
					"select:not([disabled]):not([aria-hidden])",
					"textarea:not([disabled]):not([aria-hidden])",
					"area[href]",
					"iframe",
					"object",
					"embed",
					"[contenteditable]",
					'[tabindex]:not([tabindex^="-"])',
				]),
				(this.options = {
					...e,
					...t,
					classes: { ...e.classes, ...t?.classes },
					hashSettings: { ...e.hashSettings, ...t?.hashSettings },
					on: { ...e.on, ...t?.on },
				}),
				this.options.init && this.initPopups();
		}
		initPopups() {
			this.popupLogging("Проснулся"), this.eventsPopup();
		}
		eventsPopup() {
			document.addEventListener(
				"click",
				function (t) {
					const e = t.target.closest(`[${this.options.attributeOpenButton}]`);
					if (e)
						return (
							t.preventDefault(),
							(this._dataValue = e.getAttribute(
								this.options.attributeOpenButton
							)
								? e.getAttribute(this.options.attributeOpenButton)
								: "error"),
							"error" !== this._dataValue
								? (this.isOpen || (this.lastFocusEl = e),
									(this.targetOpen.selector = `${this._dataValue}`),
									(this._selectorOpen = !0),
									void this.open())
								: void this.popupLogging(
									`Ой ой, не заполнен атрибут у ${e.classList}`
								)
						);
					return t.target.closest(`[${this.options.attributeCloseButton}]`) ||
						(!t.target.closest(`.${this.options.classes.popupContent}`) &&
							this.isOpen)
						? (t.preventDefault(), void this.close())
						: void 0;
				}.bind(this)
			),
				document.addEventListener(
					"keydown",
					function (t) {
						if (
							this.options.closeEsc &&
							27 == t.which &&
							"Escape" === t.code &&
							this.isOpen
						)
							return t.preventDefault(), void this.close();
						this.options.focusCatch &&
							9 == t.which &&
							this.isOpen &&
							this._focusCatch(t);
					}.bind(this)
				),
				this.options.hashSettings.goHash &&
				(window.addEventListener(
					"hashchange",
					function () {
						window.location.hash
							? this._openToHash()
							: this.close(this.targetOpen.selector);
					}.bind(this)
				),
					window.addEventListener(
						"load",
						function () {
							window.location.hash && this._openToHash();
						}.bind(this)
					));
		}
		open(t) {
			if (
				(t &&
					"string" == typeof t &&
					"" !== t.trim() &&
					((this.targetOpen.selector = t), (this._selectorOpen = !0)),
					this.isOpen && ((this._reopen = !0), this.close()),
					this._selectorOpen ||
					(this.targetOpen.selector = this.lastClosed.selector),
					this._reopen || (this.previousActiveElement = document.activeElement),
					(this.targetOpen.element = document.querySelector(
						this.targetOpen.selector
					)),
					this.targetOpen.element)
			) {
				if (
					this.targetOpen.element.hasAttribute(this.options.youtubeAttribute)
				) {
					const t = `https://www.youtube.com/embed/${this.targetOpen.element.getAttribute(
						this.options.youtubeAttribute
					)}?rel=0&showinfo=0&autoplay=1`,
						e = document.createElement("iframe");
					e.setAttribute("allowfullscreen", "");
					const n = this.options.setAutoplayYoutube ? "autoplay;" : "";
					e.setAttribute("allow", `${n}; encrypted-media`),
						e.setAttribute("src", t),
						this.targetOpen.element.querySelector(
							`[${this.options.youtubePlaceAttribute}]`
						) &&
						this.targetOpen.element
							.querySelector(`[${this.options.youtubePlaceAttribute}]`)
							.appendChild(e);
				}
				this.options.hashSettings.location &&
					(this._getHash(), this._setHash()),
					this.options.on.beforeOpen(this),
					this.targetOpen.element.classList.add(
						this.options.classes.popupActive
					),
					document.body.classList.add(this.options.classes.bodyActive),
					this._reopen ? (this._reopen = !1) : s(),
					this.targetOpen.element.setAttribute("aria-hidden", "false"),
					(this.previousOpen.selector = this.targetOpen.selector),
					(this.previousOpen.element = this.targetOpen.element),
					(this._selectorOpen = !1),
					(this.isOpen = !0),
					setTimeout(() => {
						this._focusTrap();
					}, 50),
					document.dispatchEvent(
						new CustomEvent("afterPopupOpen", { detail: { popup: this } })
					),
					this.popupLogging("Открыл попап");
			} else
				this.popupLogging(
					"Ой ой, такого попапа нет. Проверьте корректность ввода. "
				);
		}
		close(t) {
			t &&
				"string" == typeof t &&
				"" !== t.trim() &&
				(this.previousOpen.selector = t),
				this.isOpen &&
				i &&
				(this.options.on.beforeClose(this),
					this.targetOpen.element.hasAttribute(this.options.youtubeAttribute) &&
					this.targetOpen.element.querySelector(
						`[${this.options.youtubePlaceAttribute}]`
					) &&
					(this.targetOpen.element.querySelector(
						`[${this.options.youtubePlaceAttribute}]`
					).innerHTML = ""),
					this.previousOpen.element.classList.remove(
						this.options.classes.popupActive
					),
					this.previousOpen.element.setAttribute("aria-hidden", "true"),
					this._reopen ||
					(document.body.classList.remove(this.options.classes.bodyActive),
						s(),
						(this.isOpen = !1)),
					this._removeHash(),
					this._selectorOpen &&
					((this.lastClosed.selector = this.previousOpen.selector),
						(this.lastClosed.element = this.previousOpen.element)),
					this.options.on.afterClose(this),
					setTimeout(() => {
						this._focusTrap();
					}, 50),
					this.popupLogging("Закрыл попап"));
		}
		_getHash() {
			this.options.hashSettings.location &&
				(this.hash = this.targetOpen.selector.includes("#")
					? this.targetOpen.selector
					: this.targetOpen.selector.replace(".", "#"));
		}
		_openToHash() {
			let t = document.querySelector(
				`.${window.location.hash.replace("#", "")}`
			)
				? `.${window.location.hash.replace("#", "")}`
				: document.querySelector(`${window.location.hash}`)
					? `${window.location.hash}`
					: null;
			document.querySelector(`[${this.options.attributeOpenButton}="${t}"]`) &&
				t &&
				this.open(t);
		}
		_setHash() {
			history.pushState("", "", this.hash);
		}
		_removeHash() {
			history.pushState("", "", window.location.href.split("#")[0]);
		}
		_focusCatch(t) {
			const e = this.targetOpen.element.querySelectorAll(this._focusEl),
				n = Array.prototype.slice.call(e),
				i = n.indexOf(document.activeElement);
			t.shiftKey && 0 === i && (n[n.length - 1].focus(), t.preventDefault()),
				t.shiftKey || i !== n.length - 1 || (n[0].focus(), t.preventDefault());
		}
		_focusTrap() {
			const t = this.previousOpen.element.querySelectorAll(this._focusEl);
			!this.isOpen && this.lastFocusEl
				? this.lastFocusEl.focus()
				: t[0].focus();
		}
		popupLogging(t) {
			this.options.logging && u(`[Попапос]: ${t}`);
		}
	})({});
	let l = (t, e = !1, n = 500, i = 0) => {
		const s = document.querySelector(t);
		if (s) {
			let a = "",
				o = 0;
			e &&
				((a = "header.header"), (o = document.querySelector(a).offsetHeight));
			let l = {
				speedAsDuration: !0,
				speed: n,
				header: a,
				offset: i,
				easing: "easeOutQuad",
			};
			if (
				(document.documentElement.classList.contains("menu-open") &&
					(r(), document.documentElement.classList.remove("menu-open")),
					"undefined" != typeof SmoothScroll)
			)
				new SmoothScroll().animateScroll(s, "", l);
			else {
				let t = s.getBoundingClientRect().top + scrollY;
				(t = o ? t - o : t),
					(t = i ? t - i : t),
					window.scrollTo({ top: t, behavior: "smooth" });
			}
			u(`[gotoBlock]: Юхуу...едем к ${t}`);
		} else u(`[gotoBlock]: Ой ой..Такого блока нет на странице: ${t}`);
	};
	let h = {
		getErrors(t) {
			let e = 0,
				n = t.querySelectorAll("*[data-required]");
			return (
				n.length &&
				n.forEach((t) => {
					(null === t.offsetParent && "SELECT" !== t.tagName) ||
						t.disabled ||
						(e += this.validateInput(t));
				}),
				e
			);
		},
		validateInput(t) {
			let e = 0;
			return (
				"email" === t.dataset.required
					? ((t.value = t.value.replace(" ", "")),
						this.emailTest(t) ? (this.addError(t), e++) : this.removeError(t))
					: ("checkbox" !== t.type || t.checked) && t.value
						? this.removeError(t)
						: (this.addError(t), e++),
				e
			);
		},
		addError(t) {
			t.classList.add("_form-error"),
				t.parentElement.classList.add("_form-error");
			let e = t.parentElement.querySelector(".form__error");
			e && t.parentElement.removeChild(e),
				t.dataset.error &&
				t.parentElement.insertAdjacentHTML(
					"beforeend",
					`<div class="form__error">${t.dataset.error}</div>`
				);
		},
		removeError(t) {
			t.classList.remove("_form-error"),
				t.parentElement.classList.remove("_form-error"),
				t.parentElement.querySelector(".form__error") &&
				t.parentElement.removeChild(
					t.parentElement.querySelector(".form__error")
				);
		},
		formClean(e) {
			e.reset(),
				setTimeout(() => {
					let n = e.querySelectorAll("input,textarea");
					for (let t = 0; t < n.length; t++) {
						const e = n[t];
						e.parentElement.classList.remove("_form-focus"),
							e.classList.remove("_form-focus"),
							h.removeError(e);
					}
					let i = e.querySelectorAll(".checkbox__input");
					if (i.length > 0)
						for (let t = 0; t < i.length; t++) {
							i[t].checked = !1;
						}
					if (t.select) {
						let n = e.querySelectorAll(".select");
						if (n.length)
							for (let e = 0; e < n.length; e++) {
								const i = n[e].querySelector("select");
								t.select.selectBuild(i);
							}
					}
				}, 0);
		},
		emailTest: (t) =>
			!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(t.value),
	};
	t.watcher = new (class {
		constructor(t) {
			(this.config = Object.assign({ logging: !0 }, t)),
				this.observer,
				!document.documentElement.classList.contains("watcher") &&
				this.scrollWatcherRun();
		}
		scrollWatcherUpdate() {
			this.scrollWatcherRun();
		}
		scrollWatcherRun() {
			document.documentElement.classList.add("watcher"),
				this.scrollWatcherConstructor(
					document.querySelectorAll("[data-watch]")
				);
		}
		scrollWatcherConstructor(t) {
			if (t.length) {
				this.scrollWatcherLogging(
					`Проснулся, слежу за объектами (${t.length})...`
				),
					o(
						Array.from(t).map(function (t) {
							return `${t.dataset.watchRoot ? t.dataset.watchRoot : null
								}|${t.dataset.watchMargin ? t.dataset.watchMargin : "0px"}|${t.dataset.watchThreshold ? t.dataset.watchThreshold : 0}`;
						})
					).forEach((e) => {
						let n = e.split("|"),
							i = { root: n[0], margin: n[1], threshold: n[2] },
							s = Array.from(t).filter(function (t) {
								let e = t.dataset.watchRoot ? t.dataset.watchRoot : null,
									n = t.dataset.watchMargin ? t.dataset.watchMargin : "0px",
									s = t.dataset.watchThreshold ? t.dataset.watchThreshold : 0;
								if (
									String(e) === i.root &&
									String(n) === i.margin &&
									String(s) === i.threshold
								)
									return t;
							}),
							r = this.getScrollWatcherConfig(i);
						this.scrollWatcherInit(s, r);
					});
			} else
				this.scrollWatcherLogging("Сплю, нет объектов для слежения. ZzzZZzz");
		}
		getScrollWatcherConfig(t) {
			let e = {};
			if (
				(document.querySelector(t.root)
					? (e.root = document.querySelector(t.root))
					: "null" !== t.root &&
					this.scrollWatcherLogging(
						`Эмм... родительского объекта ${t.root} нет на странице`
					),
					(e.rootMargin = t.margin),
					!(t.margin.indexOf("px") < 0 && t.margin.indexOf("%") < 0))
			) {
				if ("prx" === t.threshold) {
					t.threshold = [];
					for (let e = 0; e <= 1; e += 0.005) t.threshold.push(e);
				} else t.threshold = t.threshold.split(",");
				return (e.threshold = t.threshold), e;
			}
			this.scrollWatcherLogging(
				"Ой ой, настройку data-watch-margin нужно задавать в PX или %"
			);
		}
		scrollWatcherCreate(t) {
			this.observer = new IntersectionObserver((t, e) => {
				t.forEach((t) => {
					this.scrollWatcherCallback(t, e);
				});
			}, t);
		}
		scrollWatcherInit(t, e) {
			this.scrollWatcherCreate(e), t.forEach((t) => this.observer.observe(t));
		}
		scrollWatcherIntersecting(t, e) {
			t.isIntersecting
				? (!e.classList.contains("_watcher-view") &&
					e.classList.add("_watcher-view"),
					this.scrollWatcherLogging(
						`Я вижу ${e.classList}, добавил класс _watcher-view`
					))
				: (e.classList.contains("_watcher-view") &&
					e.classList.remove("_watcher-view"),
					this.scrollWatcherLogging(
						`Я не вижу ${e.classList}, убрал класс _watcher-view`
					));
		}
		scrollWatcherOff(t, e) {
			e.unobserve(t),
				this.scrollWatcherLogging(`Я перестал следить за ${t.classList}`);
		}
		scrollWatcherLogging(t) {
			this.config.logging && u(`[Наблюдатель]: ${t}`);
		}
		scrollWatcherCallback(t, e) {
			const n = t.target;
			this.scrollWatcherIntersecting(t, n),
				n.hasAttribute("data-watch-once") &&
				t.isIntersecting &&
				this.scrollWatcherOff(n, e),
				document.dispatchEvent(
					new CustomEvent("watcherCallback", { detail: { entry: t } })
				);
		}
	})({});
	let c = !1;
	function d(t) {
		this.type = t;
	}
	setTimeout(() => {
		if (c) {
			let t = new Event("windowScroll");
			window.addEventListener("scroll", function (e) {
				document.dispatchEvent(t);
			});
		}
	}, 0),
		(d.prototype.init = function () {
			const t = this;
			(this.оbjects = []),
				(this.daClassname = "_dynamic_adapt_"),
				(this.nodes = document.querySelectorAll("[data-da]"));
			for (let t = 0; t < this.nodes.length; t++) {
				const e = this.nodes[t],
					n = e.dataset.da.trim().split(","),
					i = {};
				(i.element = e),
					(i.parent = e.parentNode),
					(i.destination = document.querySelector(n[0].trim())),
					(i.breakpoint = n[1] ? n[1].trim() : "767"),
					(i.place = n[2] ? n[2].trim() : "last"),
					(i.index = this.indexInParent(i.parent, i.element)),
					this.оbjects.push(i);
			}
			this.arraySort(this.оbjects),
				(this.mediaQueries = Array.prototype.map.call(
					this.оbjects,
					function (t) {
						return (
							"(" +
							this.type +
							"-width: " +
							t.breakpoint +
							"px)," +
							t.breakpoint
						);
					},
					this
				)),
				(this.mediaQueries = Array.prototype.filter.call(
					this.mediaQueries,
					function (t, e, n) {
						return Array.prototype.indexOf.call(n, t) === e;
					}
				));
			for (let e = 0; e < this.mediaQueries.length; e++) {
				const n = this.mediaQueries[e],
					i = String.prototype.split.call(n, ","),
					s = window.matchMedia(i[0]),
					r = i[1],
					a = Array.prototype.filter.call(this.оbjects, function (t) {
						return t.breakpoint === r;
					});
				s.addListener(function () {
					t.mediaHandler(s, a);
				}),
					this.mediaHandler(s, a);
			}
		}),
		(d.prototype.mediaHandler = function (t, e) {
			if (t.matches)
				for (let t = 0; t < e.length; t++) {
					const n = e[t];
					(n.index = this.indexInParent(n.parent, n.element)),
						this.moveTo(n.place, n.element, n.destination);
				}
			else
				for (let t = e.length - 1; t >= 0; t--) {
					const n = e[t];
					n.element.classList.contains(this.daClassname) &&
						this.moveBack(n.parent, n.element, n.index);
				}
		}),
		(d.prototype.moveTo = function (t, e, n) {
			e.classList.add(this.daClassname),
				"last" === t || t >= n.children.length
					? n.insertAdjacentElement("beforeend", e)
					: "first" !== t
						? n.children[t].insertAdjacentElement("beforebegin", e)
						: n.insertAdjacentElement("afterbegin", e);
		}),
		(d.prototype.moveBack = function (t, e, n) {
			e.classList.remove(this.daClassname),
				void 0 !== t.children[n]
					? t.children[n].insertAdjacentElement("beforebegin", e)
					: t.insertAdjacentElement("beforeend", e);
		}),
		(d.prototype.indexInParent = function (t, e) {
			const n = Array.prototype.slice.call(t.children);
			return Array.prototype.indexOf.call(n, e);
		}),
		(d.prototype.arraySort = function (t) {
			"min" === this.type
				? Array.prototype.sort.call(t, function (t, e) {
					return t.breakpoint === e.breakpoint
						? t.place === e.place
							? 0
							: "first" === t.place || "last" === e.place
								? -1
								: "last" === t.place || "first" === e.place
									? 1
									: t.place - e.place
						: t.breakpoint - e.breakpoint;
				})
				: Array.prototype.sort.call(t, function (t, e) {
					return t.breakpoint === e.breakpoint
						? t.place === e.place
							? 0
							: "first" === t.place || "last" === e.place
								? 1
								: "last" === t.place || "first" === e.place
									? -1
									: e.place - t.place
						: e.breakpoint - t.breakpoint;
				});
		});
	function p(t) {
		return (
			(p =
				"function" == typeof Symbol && "symbol" == typeof Symbol.iterator
					? function (t) {
						return typeof t;
					}
					: function (t) {
						return t &&
							"function" == typeof Symbol &&
							t.constructor === Symbol &&
							t !== Symbol.prototype
							? "symbol"
							: typeof t;
					}),
			p(t)
		);
	}
	function f(t, e) {
		if (!(t instanceof e))
			throw new TypeError("Cannot call a class as a function");
	}
	function v(t, e) {
		for (var n = 0; n < e.length; n++) {
			var i = e[n];
			(i.enumerable = i.enumerable || !1),
				(i.configurable = !0),
				"value" in i && (i.writable = !0),
				Object.defineProperty(t, i.key, i);
		}
	}
	function g(t, e, n) {
		return e && v(t.prototype, e), n && v(t, n), t;
	}
	function m(t, e) {
		if ("function" != typeof e && null !== e)
			throw new TypeError("Super expression must either be null or a function");
		(t.prototype = Object.create(e && e.prototype, {
			constructor: { value: t, writable: !0, configurable: !0 },
		})),
			e && y(t, e);
	}
	function k(t) {
		return (
			(k = Object.setPrototypeOf
				? Object.getPrototypeOf
				: function (t) {
					return t.__proto__ || Object.getPrototypeOf(t);
				}),
			k(t)
		);
	}
	function y(t, e) {
		return (
			(y =
				Object.setPrototypeOf ||
				function (t, e) {
					return (t.__proto__ = e), t;
				}),
			y(t, e)
		);
	}
	function _(t, e) {
		if (null == t) return {};
		var n,
			i,
			s = (function (t, e) {
				if (null == t) return {};
				var n,
					i,
					s = {},
					r = Object.keys(t);
				for (i = 0; i < r.length; i++)
					(n = r[i]), e.indexOf(n) >= 0 || (s[n] = t[n]);
				return s;
			})(t, e);
		if (Object.getOwnPropertySymbols) {
			var r = Object.getOwnPropertySymbols(t);
			for (i = 0; i < r.length; i++)
				(n = r[i]),
					e.indexOf(n) >= 0 ||
					(Object.prototype.propertyIsEnumerable.call(t, n) && (s[n] = t[n]));
		}
		return s;
	}
	function A(t, e) {
		if (e && ("object" == typeof e || "function" == typeof e)) return e;
		if (void 0 !== e)
			throw new TypeError(
				"Derived constructors may only return object or undefined"
			);
		return (function (t) {
			if (void 0 === t)
				throw new ReferenceError(
					"this hasn't been initialised - super() hasn't been called"
				);
			return t;
		})(t);
	}
	function b(t) {
		var e = (function () {
			if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
			if (Reflect.construct.sham) return !1;
			if ("function" == typeof Proxy) return !0;
			try {
				return (
					Boolean.prototype.valueOf.call(
						Reflect.construct(Boolean, [], function () { })
					),
					!0
				);
			} catch (t) {
				return !1;
			}
		})();
		return function () {
			var n,
				i = k(t);
			if (e) {
				var s = k(this).constructor;
				n = Reflect.construct(i, arguments, s);
			} else n = i.apply(this, arguments);
			return A(this, n);
		};
	}
	function E(t, e) {
		for (
			;
			!Object.prototype.hasOwnProperty.call(t, e) && null !== (t = k(t));

		);
		return t;
	}
	function C(t, e, n) {
		return (
			(C =
				"undefined" != typeof Reflect && Reflect.get
					? Reflect.get
					: function (t, e, n) {
						var i = E(t, e);
						if (i) {
							var s = Object.getOwnPropertyDescriptor(i, e);
							return s.get ? s.get.call(n) : s.value;
						}
					}),
			C(t, e, n || t)
		);
	}
	function S(t, e, n, i) {
		return (
			(S =
				"undefined" != typeof Reflect && Reflect.set
					? Reflect.set
					: function (t, e, n, i) {
						var s,
							r = E(t, e);
						if (r) {
							if ((s = Object.getOwnPropertyDescriptor(r, e)).set)
								return s.set.call(i, n), !0;
							if (!s.writable) return !1;
						}
						if ((s = Object.getOwnPropertyDescriptor(i, e))) {
							if (!s.writable) return !1;
							(s.value = n), Object.defineProperty(i, e, s);
						} else
							!(function (t, e, n) {
								e in t
									? Object.defineProperty(t, e, {
										value: n,
										enumerable: !0,
										configurable: !0,
										writable: !0,
									})
									: (t[e] = n);
							})(i, e, n);
						return !0;
					}),
			S(t, e, n, i)
		);
	}
	function w(t, e, n, i, s) {
		if (!S(t, e, n, i || t) && s) throw new Error("failed to set property");
		return n;
	}
	function F(t, e) {
		return (
			(function (t) {
				if (Array.isArray(t)) return t;
			})(t) ||
			(function (t, e) {
				var n =
					null == t
						? null
						: ("undefined" != typeof Symbol && t[Symbol.iterator]) ||
						t["@@iterator"];
				if (null == n) return;
				var i,
					s,
					r = [],
					a = !0,
					u = !1;
				try {
					for (
						n = n.call(t);
						!(a = (i = n.next()).done) &&
						(r.push(i.value), !e || r.length !== e);
						a = !0
					);
				} catch (t) {
					(u = !0), (s = t);
				} finally {
					try {
						a || null == n.return || n.return();
					} finally {
						if (u) throw s;
					}
				}
				return r;
			})(t, e) ||
			(function (t, e) {
				if (!t) return;
				if ("string" == typeof t) return B(t, e);
				var n = Object.prototype.toString.call(t).slice(8, -1);
				"Object" === n && t.constructor && (n = t.constructor.name);
				if ("Map" === n || "Set" === n) return Array.from(t);
				if (
					"Arguments" === n ||
					/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)
				)
					return B(t, e);
			})(t, e) ||
			(function () {
				throw new TypeError(
					"Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
				);
			})()
		);
	}
	function B(t, e) {
		(null == e || e > t.length) && (e = t.length);
		for (var n = 0, i = new Array(e); n < e; n++) i[n] = t[n];
		return i;
	}
	function D(t) {
		return "string" == typeof t || t instanceof String;
	}
	new d("max").init();
	var x = "NONE",
		O = "LEFT",
		M = "FORCE_LEFT",
		L = "RIGHT",
		P = "FORCE_RIGHT";
	function T(t) {
		switch (t) {
			case O:
				return M;
			case L:
				return P;
			default:
				return t;
		}
	}
	function I(t) {
		return t.replace(/([.*+?^=!:${}()|[\]\/\\])/g, "\\$1");
	}
	function R(t, e) {
		if (e === t) return !0;
		var n,
			i = Array.isArray(e),
			s = Array.isArray(t);
		if (i && s) {
			if (e.length != t.length) return !1;
			for (n = 0; n < e.length; n++) if (!R(e[n], t[n])) return !1;
			return !0;
		}
		if (i != s) return !1;
		if (e && t && "object" === p(e) && "object" === p(t)) {
			var r = e instanceof Date,
				a = t instanceof Date;
			if (r && a) return e.getTime() == t.getTime();
			if (r != a) return !1;
			var u = e instanceof RegExp,
				o = t instanceof RegExp;
			if (u && o) return e.toString() == t.toString();
			if (u != o) return !1;
			var l = Object.keys(e);
			for (n = 0; n < l.length; n++)
				if (!Object.prototype.hasOwnProperty.call(t, l[n])) return !1;
			for (n = 0; n < l.length; n++) if (!R(t[l[n]], e[l[n]])) return !1;
			return !0;
		}
		return (
			!(!e || !t || "function" != typeof e || "function" != typeof t) &&
			e.toString() === t.toString()
		);
	}
	var V = (function () {
		function t(e, n, i, s) {
			for (
				f(this, t),
				this.value = e,
				this.cursorPos = n,
				this.oldValue = i,
				this.oldSelection = s;
				this.value.slice(0, this.startChangePos) !==
				this.oldValue.slice(0, this.startChangePos);

			)
				--this.oldSelection.start;
		}
		return (
			g(t, [
				{
					key: "startChangePos",
					get: function () {
						return Math.min(this.cursorPos, this.oldSelection.start);
					},
				},
				{
					key: "insertedCount",
					get: function () {
						return this.cursorPos - this.startChangePos;
					},
				},
				{
					key: "inserted",
					get: function () {
						return this.value.substr(this.startChangePos, this.insertedCount);
					},
				},
				{
					key: "removedCount",
					get: function () {
						return Math.max(
							this.oldSelection.end - this.startChangePos ||
							this.oldValue.length - this.value.length,
							0
						);
					},
				},
				{
					key: "removed",
					get: function () {
						return this.oldValue.substr(
							this.startChangePos,
							this.removedCount
						);
					},
				},
				{
					key: "head",
					get: function () {
						return this.value.substring(0, this.startChangePos);
					},
				},
				{
					key: "tail",
					get: function () {
						return this.value.substring(
							this.startChangePos + this.insertedCount
						);
					},
				},
				{
					key: "removeDirection",
					get: function () {
						return !this.removedCount || this.insertedCount
							? x
							: this.oldSelection.end === this.cursorPos ||
								this.oldSelection.start === this.cursorPos
								? L
								: O;
					},
				},
			]),
			t
		);
	})(),
		j = (function () {
			function t(e) {
				f(this, t),
					Object.assign(
						this,
						{ inserted: "", rawInserted: "", skip: !1, tailShift: 0 },
						e
					);
			}
			return (
				g(t, [
					{
						key: "aggregate",
						value: function (t) {
							return (
								(this.rawInserted += t.rawInserted),
								(this.skip = this.skip || t.skip),
								(this.inserted += t.inserted),
								(this.tailShift += t.tailShift),
								this
							);
						},
					},
					{
						key: "offset",
						get: function () {
							return this.tailShift + this.inserted.length;
						},
					},
				]),
				t
			);
		})(),
		$ = (function () {
			function t() {
				var e =
					arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "",
					n =
						arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0,
					i = arguments.length > 2 ? arguments[2] : void 0;
				f(this, t), (this.value = e), (this.from = n), (this.stop = i);
			}
			return (
				g(t, [
					{
						key: "toString",
						value: function () {
							return this.value;
						},
					},
					{
						key: "extend",
						value: function (t) {
							this.value += String(t);
						},
					},
					{
						key: "appendTo",
						value: function (t) {
							return t
								.append(this.toString(), { tail: !0 })
								.aggregate(t._appendPlaceholder());
						},
					},
					{
						key: "state",
						get: function () {
							return { value: this.value, from: this.from, stop: this.stop };
						},
						set: function (t) {
							Object.assign(this, t);
						},
					},
					{
						key: "shiftBefore",
						value: function (t) {
							if (this.from >= t || !this.value.length) return "";
							var e = this.value[0];
							return (this.value = this.value.slice(1)), e;
						},
					},
				]),
				t
			);
		})();
	function q(t) {
		var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
		return new q.InputMask(t, e);
	}
	var W = (function () {
		function t(e) {
			f(this, t),
				(this._value = ""),
				this._update(Object.assign({}, t.DEFAULTS, e)),
				(this.isInitialized = !0);
		}
		return (
			g(t, [
				{
					key: "updateOptions",
					value: function (t) {
						Object.keys(t).length &&
							this.withValueRefresh(this._update.bind(this, t));
					},
				},
				{
					key: "_update",
					value: function (t) {
						Object.assign(this, t);
					},
				},
				{
					key: "state",
					get: function () {
						return { _value: this.value };
					},
					set: function (t) {
						this._value = t._value;
					},
				},
				{
					key: "reset",
					value: function () {
						this._value = "";
					},
				},
				{
					key: "value",
					get: function () {
						return this._value;
					},
					set: function (t) {
						this.resolve(t);
					},
				},
				{
					key: "resolve",
					value: function (t) {
						return (
							this.reset(),
							this.append(t, { input: !0 }, ""),
							this.doCommit(),
							this.value
						);
					},
				},
				{
					key: "unmaskedValue",
					get: function () {
						return this.value;
					},
					set: function (t) {
						this.reset(), this.append(t, {}, ""), this.doCommit();
					},
				},
				{
					key: "typedValue",
					get: function () {
						return this.doParse(this.value);
					},
					set: function (t) {
						this.value = this.doFormat(t);
					},
				},
				{
					key: "rawInputValue",
					get: function () {
						return this.extractInput(0, this.value.length, { raw: !0 });
					},
					set: function (t) {
						this.reset(), this.append(t, { raw: !0 }, ""), this.doCommit();
					},
				},
				{
					key: "isComplete",
					get: function () {
						return !0;
					},
				},
				{
					key: "nearestInputPos",
					value: function (t, e) {
						return t;
					},
				},
				{
					key: "extractInput",
					value: function () {
						var t =
							arguments.length > 0 && void 0 !== arguments[0]
								? arguments[0]
								: 0,
							e =
								arguments.length > 1 && void 0 !== arguments[1]
									? arguments[1]
									: this.value.length;
						return this.value.slice(t, e);
					},
				},
				{
					key: "extractTail",
					value: function () {
						var t =
							arguments.length > 0 && void 0 !== arguments[0]
								? arguments[0]
								: 0,
							e =
								arguments.length > 1 && void 0 !== arguments[1]
									? arguments[1]
									: this.value.length;
						return new $(this.extractInput(t, e), t);
					},
				},
				{
					key: "appendTail",
					value: function (t) {
						return D(t) && (t = new $(String(t))), t.appendTo(this);
					},
				},
				{
					key: "_appendCharRaw",
					value: function (t) {
						return t
							? ((this._value += t), new j({ inserted: t, rawInserted: t }))
							: new j();
					},
				},
				{
					key: "_appendChar",
					value: function (t) {
						var e =
							arguments.length > 1 && void 0 !== arguments[1]
								? arguments[1]
								: {},
							n = arguments.length > 2 ? arguments[2] : void 0,
							i = this.state,
							s = this._appendCharRaw(this.doPrepare(t, e), e);
						if (s.inserted) {
							var r,
								a = !1 !== this.doValidate(e);
							if (a && null != n) {
								var u = this.state;
								this.overwrite &&
									((r = n.state), n.shiftBefore(this.value.length));
								var o = this.appendTail(n);
								(a = o.rawInserted === n.toString()) &&
									o.inserted &&
									(this.state = u);
							}
							a || ((s = new j()), (this.state = i), n && r && (n.state = r));
						}
						return s;
					},
				},
				{
					key: "_appendPlaceholder",
					value: function () {
						return new j();
					},
				},
				{
					key: "append",
					value: function (t, e, n) {
						if (!D(t)) throw new Error("value should be string");
						var i = new j(),
							s = D(n) ? new $(String(n)) : n;
						e && e.tail && (e._beforeTailState = this.state);
						for (var r = 0; r < t.length; ++r)
							i.aggregate(this._appendChar(t[r], e, s));
						return (
							null != s && (i.tailShift += this.appendTail(s).tailShift), i
						);
					},
				},
				{
					key: "remove",
					value: function () {
						var t =
							arguments.length > 0 && void 0 !== arguments[0]
								? arguments[0]
								: 0,
							e =
								arguments.length > 1 && void 0 !== arguments[1]
									? arguments[1]
									: this.value.length;
						return (
							(this._value = this.value.slice(0, t) + this.value.slice(e)),
							new j()
						);
					},
				},
				{
					key: "withValueRefresh",
					value: function (t) {
						if (this._refreshing || !this.isInitialized) return t();
						this._refreshing = !0;
						var e = this.rawInputValue,
							n = this.value,
							i = t();
						return (
							(this.rawInputValue = e),
							this.value &&
							this.value !== n &&
							0 === n.indexOf(this.value) &&
							this.append(n.slice(this.value.length), {}, ""),
							delete this._refreshing,
							i
						);
					},
				},
				{
					key: "runIsolated",
					value: function (t) {
						if (this._isolated || !this.isInitialized) return t(this);
						this._isolated = !0;
						var e = this.state,
							n = t(this);
						return (this.state = e), delete this._isolated, n;
					},
				},
				{
					key: "doPrepare",
					value: function (t) {
						var e =
							arguments.length > 1 && void 0 !== arguments[1]
								? arguments[1]
								: {};
						return this.prepare ? this.prepare(t, this, e) : t;
					},
				},
				{
					key: "doValidate",
					value: function (t) {
						return (
							(!this.validate || this.validate(this.value, this, t)) &&
							(!this.parent || this.parent.doValidate(t))
						);
					},
				},
				{
					key: "doCommit",
					value: function () {
						this.commit && this.commit(this.value, this);
					},
				},
				{
					key: "doFormat",
					value: function (t) {
						return this.format ? this.format(t, this) : t;
					},
				},
				{
					key: "doParse",
					value: function (t) {
						return this.parse ? this.parse(t, this) : t;
					},
				},
				{
					key: "splice",
					value: function (t, e, n, i) {
						var s = t + e,
							r = this.extractTail(s),
							a = this.nearestInputPos(t, i);
						return new j({ tailShift: a - t })
							.aggregate(this.remove(a))
							.aggregate(this.append(n, { input: !0 }, r));
					},
				},
			]),
			t
		);
	})();
	function H(t) {
		if (null == t) throw new Error("mask property should be defined");
		return t instanceof RegExp
			? q.MaskedRegExp
			: D(t)
				? q.MaskedPattern
				: t instanceof Date || t === Date
					? q.MaskedDate
					: t instanceof Number || "number" == typeof t || t === Number
						? q.MaskedNumber
						: Array.isArray(t) || t === Array
							? q.MaskedDynamic
							: q.Masked && t.prototype instanceof q.Masked
								? t
								: t instanceof Function
									? q.MaskedFunction
									: t instanceof q.Masked
										? t.constructor
										: (console.warn("Mask not found for mask", t), q.Masked);
	}
	function N(t) {
		if (q.Masked && t instanceof q.Masked) return t;
		var e = (t = Object.assign({}, t)).mask;
		if (q.Masked && e instanceof q.Masked) return e;
		var n = H(e);
		if (!n)
			throw new Error(
				"Masked class is not found for provided mask, appropriate module needs to be import manually before creating mask."
			);
		return new n(t);
	}
	(W.DEFAULTS = {
		format: function (t) {
			return t;
		},
		parse: function (t) {
			return t;
		},
	}),
		(q.Masked = W),
		(q.createMask = N);
	var U = ["mask"],
		z = {
			0: /\d/,
			a: /[\u0041-\u005A\u0061-\u007A\u00AA\u00B5\u00BA\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u0527\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0\u08A2-\u08AC\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0977\u0979-\u097F\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C33\u0C35-\u0C39\u0C3D\u0C58\u0C59\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D60\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191C\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19C1-\u19C7\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2183\u2184\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005\u3006\u3031-\u3035\u303B\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA697\uA6A0-\uA6E5\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA793\uA7A0-\uA7AA\uA7F8-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA80-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uABC0-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]/,
			"*": /./,
		},
		Y = (function () {
			function t(e) {
				f(this, t);
				var n = e.mask,
					i = _(e, U);
				(this.masked = N({ mask: n })), Object.assign(this, i);
			}
			return (
				g(t, [
					{
						key: "reset",
						value: function () {
							(this._isFilled = !1), this.masked.reset();
						},
					},
					{
						key: "remove",
						value: function () {
							var t =
								arguments.length > 0 && void 0 !== arguments[0]
									? arguments[0]
									: 0,
								e =
									arguments.length > 1 && void 0 !== arguments[1]
										? arguments[1]
										: this.value.length;
							return 0 === t && e >= 1
								? ((this._isFilled = !1), this.masked.remove(t, e))
								: new j();
						},
					},
					{
						key: "value",
						get: function () {
							return (
								this.masked.value ||
								(this._isFilled && !this.isOptional ? this.placeholderChar : "")
							);
						},
					},
					{
						key: "unmaskedValue",
						get: function () {
							return this.masked.unmaskedValue;
						},
					},
					{
						key: "isComplete",
						get: function () {
							return Boolean(this.masked.value) || this.isOptional;
						},
					},
					{
						key: "_appendChar",
						value: function (t) {
							var e =
								arguments.length > 1 && void 0 !== arguments[1]
									? arguments[1]
									: {};
							if (this._isFilled) return new j();
							var n = this.masked.state,
								i = this.masked._appendChar(t, e);
							return (
								i.inserted &&
								!1 === this.doValidate(e) &&
								((i.inserted = i.rawInserted = ""), (this.masked.state = n)),
								i.inserted ||
								this.isOptional ||
								this.lazy ||
								e.input ||
								(i.inserted = this.placeholderChar),
								(i.skip = !i.inserted && !this.isOptional),
								(this._isFilled = Boolean(i.inserted)),
								i
							);
						},
					},
					{
						key: "append",
						value: function () {
							var t;
							return (t = this.masked).append.apply(t, arguments);
						},
					},
					{
						key: "_appendPlaceholder",
						value: function () {
							var t = new j();
							return (
								this._isFilled ||
								this.isOptional ||
								((this._isFilled = !0), (t.inserted = this.placeholderChar)),
								t
							);
						},
					},
					{
						key: "extractTail",
						value: function () {
							var t;
							return (t = this.masked).extractTail.apply(t, arguments);
						},
					},
					{
						key: "appendTail",
						value: function () {
							var t;
							return (t = this.masked).appendTail.apply(t, arguments);
						},
					},
					{
						key: "extractInput",
						value: function () {
							var t =
								arguments.length > 0 && void 0 !== arguments[0]
									? arguments[0]
									: 0,
								e =
									arguments.length > 1 && void 0 !== arguments[1]
										? arguments[1]
										: this.value.length,
								n = arguments.length > 2 ? arguments[2] : void 0;
							return this.masked.extractInput(t, e, n);
						},
					},
					{
						key: "nearestInputPos",
						value: function (t) {
							var e =
								arguments.length > 1 && void 0 !== arguments[1]
									? arguments[1]
									: x,
								n = 0,
								i = this.value.length,
								s = Math.min(Math.max(t, n), i);
							switch (e) {
								case O:
								case M:
									return this.isComplete ? s : n;
								case L:
								case P:
									return this.isComplete ? s : i;
								default:
									return s;
							}
						},
					},
					{
						key: "doValidate",
						value: function () {
							var t, e;
							return (
								(t = this.masked).doValidate.apply(t, arguments) &&
								(!this.parent ||
									(e = this.parent).doValidate.apply(e, arguments))
							);
						},
					},
					{
						key: "doCommit",
						value: function () {
							this.masked.doCommit();
						},
					},
					{
						key: "state",
						get: function () {
							return { masked: this.masked.state, _isFilled: this._isFilled };
						},
						set: function (t) {
							(this.masked.state = t.masked), (this._isFilled = t._isFilled);
						},
					},
				]),
				t
			);
		})(),
		Z = (function () {
			function t(e) {
				f(this, t), Object.assign(this, e), (this._value = "");
			}
			return (
				g(t, [
					{
						key: "value",
						get: function () {
							return this._value;
						},
					},
					{
						key: "unmaskedValue",
						get: function () {
							return this.isUnmasking ? this.value : "";
						},
					},
					{
						key: "reset",
						value: function () {
							(this._isRawInput = !1), (this._value = "");
						},
					},
					{
						key: "remove",
						value: function () {
							var t =
								arguments.length > 0 && void 0 !== arguments[0]
									? arguments[0]
									: 0,
								e =
									arguments.length > 1 && void 0 !== arguments[1]
										? arguments[1]
										: this._value.length;
							return (
								(this._value = this._value.slice(0, t) + this._value.slice(e)),
								this._value || (this._isRawInput = !1),
								new j()
							);
						},
					},
					{
						key: "nearestInputPos",
						value: function (t) {
							var e =
								arguments.length > 1 && void 0 !== arguments[1]
									? arguments[1]
									: x,
								n = 0,
								i = this._value.length;
							switch (e) {
								case O:
								case M:
									return n;
								default:
									return i;
							}
						},
					},
					{
						key: "extractInput",
						value: function () {
							var t =
								arguments.length > 0 && void 0 !== arguments[0]
									? arguments[0]
									: 0,
								e =
									arguments.length > 1 && void 0 !== arguments[1]
										? arguments[1]
										: this._value.length,
								n =
									arguments.length > 2 && void 0 !== arguments[2]
										? arguments[2]
										: {};
							return (
								(n.raw && this._isRawInput && this._value.slice(t, e)) || ""
							);
						},
					},
					{
						key: "isComplete",
						get: function () {
							return !0;
						},
					},
					{
						key: "_appendChar",
						value: function (t) {
							var e =
								arguments.length > 1 && void 0 !== arguments[1]
									? arguments[1]
									: {},
								n = new j();
							if (this._value) return n;
							var i = this.char === t[0],
								s = i && (this.isUnmasking || e.input || e.raw) && !e.tail;
							return (
								s && (n.rawInserted = this.char),
								(this._value = n.inserted = this.char),
								(this._isRawInput = s && (e.raw || e.input)),
								n
							);
						},
					},
					{
						key: "_appendPlaceholder",
						value: function () {
							var t = new j();
							return this._value || (this._value = t.inserted = this.char), t;
						},
					},
					{
						key: "extractTail",
						value: function () {
							return (
								(arguments.length > 1 && void 0 !== arguments[1]) ||
								this.value.length,
								new $("")
							);
						},
					},
					{
						key: "appendTail",
						value: function (t) {
							return D(t) && (t = new $(String(t))), t.appendTo(this);
						},
					},
					{
						key: "append",
						value: function (t, e, n) {
							var i = this._appendChar(t, e);
							return (
								null != n && (i.tailShift += this.appendTail(n).tailShift), i
							);
						},
					},
					{ key: "doCommit", value: function () { } },
					{
						key: "state",
						get: function () {
							return { _value: this._value, _isRawInput: this._isRawInput };
						},
						set: function (t) {
							Object.assign(this, t);
						},
					},
				]),
				t
			);
		})(),
		K = ["chunks"],
		Q = (function () {
			function t() {
				var e =
					arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : [],
					n =
						arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0;
				f(this, t), (this.chunks = e), (this.from = n);
			}
			return (
				g(t, [
					{
						key: "toString",
						value: function () {
							return this.chunks.map(String).join("");
						},
					},
					{
						key: "extend",
						value: function (e) {
							if (String(e)) {
								D(e) && (e = new $(String(e)));
								var n = this.chunks[this.chunks.length - 1],
									i =
										n &&
										(n.stop === e.stop || null == e.stop) &&
										e.from === n.from + n.toString().length;
								if (e instanceof $)
									i ? n.extend(e.toString()) : this.chunks.push(e);
								else if (e instanceof t) {
									if (null == e.stop)
										for (var s; e.chunks.length && null == e.chunks[0].stop;)
											((s = e.chunks.shift()).from += e.from), this.extend(s);
									e.toString() &&
										((e.stop = e.blockIndex), this.chunks.push(e));
								}
							}
						},
					},
					{
						key: "appendTo",
						value: function (e) {
							if (!(e instanceof q.MaskedPattern))
								return new $(this.toString()).appendTo(e);
							for (
								var n = new j(), i = 0;
								i < this.chunks.length && !n.skip;
								++i
							) {
								var s = this.chunks[i],
									r = e._mapPosToBlock(e.value.length),
									a = s.stop,
									u = void 0;
								if (
									(null != a &&
										(!r || r.index <= a) &&
										((s instanceof t || e._stops.indexOf(a) >= 0) &&
											n.aggregate(e._appendPlaceholder(a)),
											(u = s instanceof t && e._blocks[a])),
										u)
								) {
									var o = u.appendTail(s);
									(o.skip = !1), n.aggregate(o), (e._value += o.inserted);
									var l = s.toString().slice(o.rawInserted.length);
									l && n.aggregate(e.append(l, { tail: !0 }));
								} else n.aggregate(e.append(s.toString(), { tail: !0 }));
							}
							return n;
						},
					},
					{
						key: "state",
						get: function () {
							return {
								chunks: this.chunks.map(function (t) {
									return t.state;
								}),
								from: this.from,
								stop: this.stop,
								blockIndex: this.blockIndex,
							};
						},
						set: function (e) {
							var n = e.chunks,
								i = _(e, K);
							Object.assign(this, i),
								(this.chunks = n.map(function (e) {
									var n = "chunks" in e ? new t() : new $();
									return (n.state = e), n;
								}));
						},
					},
					{
						key: "shiftBefore",
						value: function (t) {
							if (this.from >= t || !this.chunks.length) return "";
							for (var e = t - this.from, n = 0; n < this.chunks.length;) {
								var i = this.chunks[n],
									s = i.shiftBefore(e);
								if (i.toString()) {
									if (!s) break;
									++n;
								} else this.chunks.splice(n, 1);
								if (s) return s;
							}
							return "";
						},
					},
				]),
				t
			);
		})(),
		X = (function (t) {
			m(n, t);
			var e = b(n);
			function n() {
				return f(this, n), e.apply(this, arguments);
			}
			return (
				g(n, [
					{
						key: "_update",
						value: function (t) {
							t.mask &&
								(t.validate = function (e) {
									return e.search(t.mask) >= 0;
								}),
								C(k(n.prototype), "_update", this).call(this, t);
						},
					},
				]),
				n
			);
		})(W);
	q.MaskedRegExp = X;
	var G = ["_blocks"],
		J = (function (t) {
			m(n, t);
			var e = b(n);
			function n() {
				var t =
					arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
				return (
					f(this, n),
					(t.definitions = Object.assign({}, z, t.definitions)),
					e.call(this, Object.assign({}, n.DEFAULTS, t))
				);
			}
			return (
				g(n, [
					{
						key: "_update",
						value: function () {
							var t =
								arguments.length > 0 && void 0 !== arguments[0]
									? arguments[0]
									: {};
							(t.definitions = Object.assign(
								{},
								this.definitions,
								t.definitions
							)),
								C(k(n.prototype), "_update", this).call(this, t),
								this._rebuildMask();
						},
					},
					{
						key: "_rebuildMask",
						value: function () {
							var t = this,
								e = this.definitions;
							(this._blocks = []),
								(this._stops = []),
								(this._maskedBlocks = {});
							var i = this.mask;
							if (i && e)
								for (var s = !1, r = !1, a = 0; a < i.length; ++a) {
									if (this.blocks)
										if (
											"continue" ===
											(function () {
												var e = i.slice(a),
													n = Object.keys(t.blocks).filter(function (t) {
														return 0 === e.indexOf(t);
													});
												n.sort(function (t, e) {
													return e.length - t.length;
												});
												var s = n[0];
												if (s) {
													var r = N(
														Object.assign(
															{
																parent: t,
																lazy: t.lazy,
																placeholderChar: t.placeholderChar,
																overwrite: t.overwrite,
															},
															t.blocks[s]
														)
													);
													return (
														r &&
														(t._blocks.push(r),
															t._maskedBlocks[s] || (t._maskedBlocks[s] = []),
															t._maskedBlocks[s].push(t._blocks.length - 1)),
														(a += s.length - 1),
														"continue"
													);
												}
											})()
										)
											continue;
									var u = i[a],
										o = u in e;
									if (u !== n.STOP_CHAR)
										if ("{" !== u && "}" !== u)
											if ("[" !== u && "]" !== u) {
												if (u === n.ESCAPE_CHAR) {
													if ((++a, !(u = i[a]))) break;
													o = !1;
												}
												var l = o
													? new Y({
														parent: this,
														lazy: this.lazy,
														placeholderChar: this.placeholderChar,
														mask: e[u],
														isOptional: r,
													})
													: new Z({ char: u, isUnmasking: s });
												this._blocks.push(l);
											} else r = !r;
										else s = !s;
									else this._stops.push(this._blocks.length);
								}
						},
					},
					{
						key: "state",
						get: function () {
							return Object.assign({}, C(k(n.prototype), "state", this), {
								_blocks: this._blocks.map(function (t) {
									return t.state;
								}),
							});
						},
						set: function (t) {
							var e = t._blocks,
								i = _(t, G);
							this._blocks.forEach(function (t, n) {
								return (t.state = e[n]);
							}),
								w(k(n.prototype), "state", i, this, !0);
						},
					},
					{
						key: "reset",
						value: function () {
							C(k(n.prototype), "reset", this).call(this),
								this._blocks.forEach(function (t) {
									return t.reset();
								});
						},
					},
					{
						key: "isComplete",
						get: function () {
							return this._blocks.every(function (t) {
								return t.isComplete;
							});
						},
					},
					{
						key: "doCommit",
						value: function () {
							this._blocks.forEach(function (t) {
								return t.doCommit();
							}),
								C(k(n.prototype), "doCommit", this).call(this);
						},
					},
					{
						key: "unmaskedValue",
						get: function () {
							return this._blocks.reduce(function (t, e) {
								return t + e.unmaskedValue;
							}, "");
						},
						set: function (t) {
							w(k(n.prototype), "unmaskedValue", t, this, !0);
						},
					},
					{
						key: "value",
						get: function () {
							return this._blocks.reduce(function (t, e) {
								return t + e.value;
							}, "");
						},
						set: function (t) {
							w(k(n.prototype), "value", t, this, !0);
						},
					},
					{
						key: "appendTail",
						value: function (t) {
							return C(k(n.prototype), "appendTail", this)
								.call(this, t)
								.aggregate(this._appendPlaceholder());
						},
					},
					{
						key: "_appendCharRaw",
						value: function (t) {
							var e =
								arguments.length > 1 && void 0 !== arguments[1]
									? arguments[1]
									: {},
								n = this._mapPosToBlock(this.value.length),
								i = new j();
							if (!n) return i;
							for (var s = n.index; ; ++s) {
								var r = this._blocks[s];
								if (!r) break;
								var a = r._appendChar(t, e),
									u = a.skip;
								if ((i.aggregate(a), u || a.rawInserted)) break;
							}
							return i;
						},
					},
					{
						key: "extractTail",
						value: function () {
							var t = this,
								e =
									arguments.length > 0 && void 0 !== arguments[0]
										? arguments[0]
										: 0,
								n =
									arguments.length > 1 && void 0 !== arguments[1]
										? arguments[1]
										: this.value.length,
								i = new Q();
							return (
								e === n ||
								this._forEachBlocksInRange(e, n, function (e, n, s, r) {
									var a = e.extractTail(s, r);
									(a.stop = t._findStopBefore(n)),
										(a.from = t._blockStartPos(n)),
										a instanceof Q && (a.blockIndex = n),
										i.extend(a);
								}),
								i
							);
						},
					},
					{
						key: "extractInput",
						value: function () {
							var t =
								arguments.length > 0 && void 0 !== arguments[0]
									? arguments[0]
									: 0,
								e =
									arguments.length > 1 && void 0 !== arguments[1]
										? arguments[1]
										: this.value.length,
								n =
									arguments.length > 2 && void 0 !== arguments[2]
										? arguments[2]
										: {};
							if (t === e) return "";
							var i = "";
							return (
								this._forEachBlocksInRange(t, e, function (t, e, s, r) {
									i += t.extractInput(s, r, n);
								}),
								i
							);
						},
					},
					{
						key: "_findStopBefore",
						value: function (t) {
							for (var e, n = 0; n < this._stops.length; ++n) {
								var i = this._stops[n];
								if (!(i <= t)) break;
								e = i;
							}
							return e;
						},
					},
					{
						key: "_appendPlaceholder",
						value: function (t) {
							var e = this,
								n = new j();
							if (this.lazy && null == t) return n;
							var i = this._mapPosToBlock(this.value.length);
							if (!i) return n;
							var s = i.index,
								r = null != t ? t : this._blocks.length;
							return (
								this._blocks.slice(s, r).forEach(function (i) {
									if (!i.lazy || null != t) {
										var s = null != i._blocks ? [i._blocks.length] : [],
											r = i._appendPlaceholder.apply(i, s);
										(e._value += r.inserted), n.aggregate(r);
									}
								}),
								n
							);
						},
					},
					{
						key: "_mapPosToBlock",
						value: function (t) {
							for (var e = "", n = 0; n < this._blocks.length; ++n) {
								var i = this._blocks[n],
									s = e.length;
								if (t <= (e += i.value).length)
									return { index: n, offset: t - s };
							}
						},
					},
					{
						key: "_blockStartPos",
						value: function (t) {
							return this._blocks.slice(0, t).reduce(function (t, e) {
								return t + e.value.length;
							}, 0);
						},
					},
					{
						key: "_forEachBlocksInRange",
						value: function (t) {
							var e =
								arguments.length > 1 && void 0 !== arguments[1]
									? arguments[1]
									: this.value.length,
								n = arguments.length > 2 ? arguments[2] : void 0,
								i = this._mapPosToBlock(t);
							if (i) {
								var s = this._mapPosToBlock(e),
									r = s && i.index === s.index,
									a = i.offset,
									u = s && r ? s.offset : this._blocks[i.index].value.length;
								if ((n(this._blocks[i.index], i.index, a, u), s && !r)) {
									for (var o = i.index + 1; o < s.index; ++o)
										n(this._blocks[o], o, 0, this._blocks[o].value.length);
									n(this._blocks[s.index], s.index, 0, s.offset);
								}
							}
						},
					},
					{
						key: "remove",
						value: function () {
							var t =
								arguments.length > 0 && void 0 !== arguments[0]
									? arguments[0]
									: 0,
								e =
									arguments.length > 1 && void 0 !== arguments[1]
										? arguments[1]
										: this.value.length,
								i = C(k(n.prototype), "remove", this).call(this, t, e);
							return (
								this._forEachBlocksInRange(t, e, function (t, e, n, s) {
									i.aggregate(t.remove(n, s));
								}),
								i
							);
						},
					},
					{
						key: "nearestInputPos",
						value: function (t) {
							var e =
								arguments.length > 1 && void 0 !== arguments[1]
									? arguments[1]
									: x,
								n = this._mapPosToBlock(t) || { index: 0, offset: 0 },
								i = n.offset,
								s = n.index,
								r = this._blocks[s];
							if (!r) return t;
							var a = i;
							0 !== a && a < r.value.length && (a = r.nearestInputPos(i, T(e)));
							var u = a === r.value.length,
								o = 0 === a;
							if (!o && !u) return this._blockStartPos(s) + a;
							var l = u ? s + 1 : s;
							if (e === x) {
								if (l > 0) {
									var h = l - 1,
										c = this._blocks[h],
										d = c.nearestInputPos(0, x);
									if (!c.value.length || d !== c.value.length)
										return this._blockStartPos(l);
								}
								for (var p = l, f = p; f < this._blocks.length; ++f) {
									var v = this._blocks[f],
										g = v.nearestInputPos(0, x);
									if (!v.value.length || g !== v.value.length)
										return this._blockStartPos(f) + g;
								}
								for (var m = l - 1; m >= 0; --m) {
									var k = this._blocks[m],
										y = k.nearestInputPos(0, x);
									if (!k.value.length || y !== k.value.length)
										return this._blockStartPos(m) + k.value.length;
								}
								return t;
							}
							if (e === O || e === M) {
								for (var _, A = l; A < this._blocks.length; ++A)
									if (this._blocks[A].value) {
										_ = A;
										break;
									}
								if (null != _) {
									var b = this._blocks[_],
										E = b.nearestInputPos(0, L);
									if (0 === E && b.unmaskedValue.length)
										return this._blockStartPos(_) + E;
								}
								for (var C, S = -1, w = l - 1; w >= 0; --w) {
									var F = this._blocks[w],
										B = F.nearestInputPos(F.value.length, M);
									if (((F.value && 0 === B) || (C = w), 0 !== B)) {
										if (B !== F.value.length) return this._blockStartPos(w) + B;
										S = w;
										break;
									}
								}
								if (e === O)
									for (
										var D = S + 1;
										D <= Math.min(l, this._blocks.length - 1);
										++D
									) {
										var I = this._blocks[D],
											R = I.nearestInputPos(0, x),
											V = this._blockStartPos(D) + R;
										if (V > t) break;
										if (R !== I.value.length) return V;
									}
								if (S >= 0)
									return this._blockStartPos(S) + this._blocks[S].value.length;
								if (
									e === M ||
									(this.lazy && !this.extractInput() && !tt(this._blocks[l]))
								)
									return 0;
								if (null != C) return this._blockStartPos(C);
								for (var j = l; j < this._blocks.length; ++j) {
									var $ = this._blocks[j],
										q = $.nearestInputPos(0, x);
									if (!$.value.length || q !== $.value.length)
										return this._blockStartPos(j) + q;
								}
								return 0;
							}
							if (e === L || e === P) {
								for (var W, H, N = l; N < this._blocks.length; ++N) {
									var U = this._blocks[N],
										z = U.nearestInputPos(0, x);
									if (z !== U.value.length) {
										(H = this._blockStartPos(N) + z), (W = N);
										break;
									}
								}
								if (null != W && null != H) {
									for (var Y = W; Y < this._blocks.length; ++Y) {
										var Z = this._blocks[Y],
											K = Z.nearestInputPos(0, P);
										if (K !== Z.value.length) return this._blockStartPos(Y) + K;
									}
									return e === P ? this.value.length : H;
								}
								for (
									var Q = Math.min(l, this._blocks.length - 1);
									Q >= 0;
									--Q
								) {
									var X = this._blocks[Q],
										G = X.nearestInputPos(X.value.length, O);
									if (0 !== G) {
										var J = this._blockStartPos(Q) + G;
										if (J >= t) return J;
										break;
									}
								}
							}
							return t;
						},
					},
					{
						key: "maskedBlock",
						value: function (t) {
							return this.maskedBlocks(t)[0];
						},
					},
					{
						key: "maskedBlocks",
						value: function (t) {
							var e = this,
								n = this._maskedBlocks[t];
							return n
								? n.map(function (t) {
									return e._blocks[t];
								})
								: [];
						},
					},
				]),
				n
			);
		})(W);
	function tt(t) {
		if (!t) return !1;
		var e = t.value;
		return !e || t.nearestInputPos(0, x) !== e.length;
	}
	(J.DEFAULTS = { lazy: !0, placeholderChar: "_" }),
		(J.STOP_CHAR = "`"),
		(J.ESCAPE_CHAR = "\\"),
		(J.InputDefinition = Y),
		(J.FixedDefinition = Z),
		(q.MaskedPattern = J);
	var et = (function (t) {
		m(n, t);
		var e = b(n);
		function n() {
			return f(this, n), e.apply(this, arguments);
		}
		return (
			g(n, [
				{
					key: "_matchFrom",
					get: function () {
						return this.maxLength - String(this.from).length;
					},
				},
				{
					key: "_update",
					value: function (t) {
						t = Object.assign({ to: this.to || 0, from: this.from || 0 }, t);
						var e = String(t.to).length;
						null != t.maxLength && (e = Math.max(e, t.maxLength)),
							(t.maxLength = e);
						for (
							var i = String(t.from).padStart(e, "0"),
							s = String(t.to).padStart(e, "0"),
							r = 0;
							r < s.length && s[r] === i[r];

						)
							++r;
						(t.mask = s.slice(0, r).replace(/0/g, "\\0") + "0".repeat(e - r)),
							C(k(n.prototype), "_update", this).call(this, t);
					},
				},
				{
					key: "isComplete",
					get: function () {
						return C(k(n.prototype), "isComplete", this) && Boolean(this.value);
					},
				},
				{
					key: "boundaries",
					value: function (t) {
						var e = "",
							n = "",
							i = F(t.match(/^(\D*)(\d*)(\D*)/) || [], 3),
							s = i[1],
							r = i[2];
						return (
							r &&
							((e = "0".repeat(s.length) + r),
								(n = "9".repeat(s.length) + r)),
							[
								(e = e.padEnd(this.maxLength, "0")),
								(n = n.padEnd(this.maxLength, "9")),
							]
						);
					},
				},
				{
					key: "doPrepare",
					value: function (t) {
						var e =
							arguments.length > 1 && void 0 !== arguments[1]
								? arguments[1]
								: {};
						if (
							((t = C(k(n.prototype), "doPrepare", this)
								.call(this, t, e)
								.replace(/\D/g, "")),
								!this.autofix)
						)
							return t;
						for (
							var i = String(this.from).padStart(this.maxLength, "0"),
							s = String(this.to).padStart(this.maxLength, "0"),
							r = this.value,
							a = "",
							u = 0;
							u < t.length;
							++u
						) {
							var o = r + a + t[u],
								l = this.boundaries(o),
								h = F(l, 2),
								c = h[0],
								d = h[1];
							Number(d) < this.from
								? (a += i[o.length - 1])
								: Number(c) > this.to
									? (a += s[o.length - 1])
									: (a += t[u]);
						}
						return a;
					},
				},
				{
					key: "doValidate",
					value: function () {
						var t,
							e = this.value,
							i = e.search(/[^0]/);
						if (-1 === i && e.length <= this._matchFrom) return !0;
						for (
							var s = this.boundaries(e),
							r = F(s, 2),
							a = r[0],
							u = r[1],
							o = arguments.length,
							l = new Array(o),
							h = 0;
							h < o;
							h++
						)
							l[h] = arguments[h];
						return (
							this.from <= Number(u) &&
							Number(a) <= this.to &&
							(t = C(k(n.prototype), "doValidate", this)).call.apply(
								t,
								[this].concat(l)
							)
						);
					},
				},
			]),
			n
		);
	})(J);
	q.MaskedRange = et;
	var nt = (function (t) {
		m(n, t);
		var e = b(n);
		function n(t) {
			return f(this, n), e.call(this, Object.assign({}, n.DEFAULTS, t));
		}
		return (
			g(n, [
				{
					key: "_update",
					value: function (t) {
						t.mask === Date && delete t.mask, t.pattern && (t.mask = t.pattern);
						var e = t.blocks;
						(t.blocks = Object.assign({}, n.GET_DEFAULT_BLOCKS())),
							t.min && (t.blocks.Y.from = t.min.getFullYear()),
							t.max && (t.blocks.Y.to = t.max.getFullYear()),
							t.min &&
							t.max &&
							t.blocks.Y.from === t.blocks.Y.to &&
							((t.blocks.m.from = t.min.getMonth() + 1),
								(t.blocks.m.to = t.max.getMonth() + 1),
								t.blocks.m.from === t.blocks.m.to &&
								((t.blocks.d.from = t.min.getDate()),
									(t.blocks.d.to = t.max.getDate()))),
							Object.assign(t.blocks, e),
							Object.keys(t.blocks).forEach(function (e) {
								var n = t.blocks[e];
								"autofix" in n || (n.autofix = t.autofix);
							}),
							C(k(n.prototype), "_update", this).call(this, t);
					},
				},
				{
					key: "doValidate",
					value: function () {
						for (
							var t,
							e = this.date,
							i = arguments.length,
							s = new Array(i),
							r = 0;
							r < i;
							r++
						)
							s[r] = arguments[r];
						return (
							(t = C(k(n.prototype), "doValidate", this)).call.apply(
								t,
								[this].concat(s)
							) &&
							(!this.isComplete ||
								(this.isDateExist(this.value) &&
									null != e &&
									(null == this.min || this.min <= e) &&
									(null == this.max || e <= this.max)))
						);
					},
				},
				{
					key: "isDateExist",
					value: function (t) {
						return this.format(this.parse(t, this), this).indexOf(t) >= 0;
					},
				},
				{
					key: "date",
					get: function () {
						return this.typedValue;
					},
					set: function (t) {
						this.typedValue = t;
					},
				},
				{
					key: "typedValue",
					get: function () {
						return this.isComplete
							? C(k(n.prototype), "typedValue", this)
							: null;
					},
					set: function (t) {
						w(k(n.prototype), "typedValue", t, this, !0);
					},
				},
			]),
			n
		);
	})(J);
	(nt.DEFAULTS = {
		pattern: "d{.}`m{.}`Y",
		format: function (t) {
			return [
				String(t.getDate()).padStart(2, "0"),
				String(t.getMonth() + 1).padStart(2, "0"),
				t.getFullYear(),
			].join(".");
		},
		parse: function (t) {
			var e = F(t.split("."), 3),
				n = e[0],
				i = e[1],
				s = e[2];
			return new Date(s, i - 1, n);
		},
	}),
		(nt.GET_DEFAULT_BLOCKS = function () {
			return {
				d: { mask: et, from: 1, to: 31, maxLength: 2 },
				m: { mask: et, from: 1, to: 12, maxLength: 2 },
				Y: { mask: et, from: 1900, to: 9999 },
			};
		}),
		(q.MaskedDate = nt);
	var it = (function () {
		function t() {
			f(this, t);
		}
		return (
			g(t, [
				{
					key: "selectionStart",
					get: function () {
						var t;
						try {
							t = this._unsafeSelectionStart;
						} catch (t) { }
						return null != t ? t : this.value.length;
					},
				},
				{
					key: "selectionEnd",
					get: function () {
						var t;
						try {
							t = this._unsafeSelectionEnd;
						} catch (t) { }
						return null != t ? t : this.value.length;
					},
				},
				{
					key: "select",
					value: function (t, e) {
						if (
							null != t &&
							null != e &&
							(t !== this.selectionStart || e !== this.selectionEnd)
						)
							try {
								this._unsafeSelect(t, e);
							} catch (t) { }
					},
				},
				{ key: "_unsafeSelect", value: function (t, e) { } },
				{
					key: "isActive",
					get: function () {
						return !1;
					},
				},
				{ key: "bindEvents", value: function (t) { } },
				{ key: "unbindEvents", value: function () { } },
			]),
			t
		);
	})();
	q.MaskElement = it;
	var st = (function (t) {
		m(n, t);
		var e = b(n);
		function n(t) {
			var i;
			return f(this, n), ((i = e.call(this)).input = t), (i._handlers = {}), i;
		}
		return (
			g(n, [
				{
					key: "rootElement",
					get: function () {
						return this.input.getRootNode ? this.input.getRootNode() : document;
					},
				},
				{
					key: "isActive",
					get: function () {
						return this.input === this.rootElement.activeElement;
					},
				},
				{
					key: "_unsafeSelectionStart",
					get: function () {
						return this.input.selectionStart;
					},
				},
				{
					key: "_unsafeSelectionEnd",
					get: function () {
						return this.input.selectionEnd;
					},
				},
				{
					key: "_unsafeSelect",
					value: function (t, e) {
						this.input.setSelectionRange(t, e);
					},
				},
				{
					key: "value",
					get: function () {
						return this.input.value;
					},
					set: function (t) {
						this.input.value = t;
					},
				},
				{
					key: "bindEvents",
					value: function (t) {
						var e = this;
						Object.keys(t).forEach(function (i) {
							return e._toggleEventHandler(n.EVENTS_MAP[i], t[i]);
						});
					},
				},
				{
					key: "unbindEvents",
					value: function () {
						var t = this;
						Object.keys(this._handlers).forEach(function (e) {
							return t._toggleEventHandler(e);
						});
					},
				},
				{
					key: "_toggleEventHandler",
					value: function (t, e) {
						this._handlers[t] &&
							(this.input.removeEventListener(t, this._handlers[t]),
								delete this._handlers[t]),
							e && (this.input.addEventListener(t, e), (this._handlers[t] = e));
					},
				},
			]),
			n
		);
	})(it);
	(st.EVENTS_MAP = {
		selectionChange: "keydown",
		input: "input",
		drop: "drop",
		click: "click",
		focus: "focus",
		commit: "blur",
	}),
		(q.HTMLMaskElement = st);
	var rt = (function (t) {
		m(n, t);
		var e = b(n);
		function n() {
			return f(this, n), e.apply(this, arguments);
		}
		return (
			g(n, [
				{
					key: "_unsafeSelectionStart",
					get: function () {
						var t = this.rootElement,
							e = t.getSelection && t.getSelection();
						return e && e.anchorOffset;
					},
				},
				{
					key: "_unsafeSelectionEnd",
					get: function () {
						var t = this.rootElement,
							e = t.getSelection && t.getSelection();
						return e && this._unsafeSelectionStart + String(e).length;
					},
				},
				{
					key: "_unsafeSelect",
					value: function (t, e) {
						if (this.rootElement.createRange) {
							var n = this.rootElement.createRange();
							n.setStart(this.input.firstChild || this.input, t),
								n.setEnd(this.input.lastChild || this.input, e);
							var i = this.rootElement,
								s = i.getSelection && i.getSelection();
							s && (s.removeAllRanges(), s.addRange(n));
						}
					},
				},
				{
					key: "value",
					get: function () {
						return this.input.textContent;
					},
					set: function (t) {
						this.input.textContent = t;
					},
				},
			]),
			n
		);
	})(st);
	q.HTMLContenteditableMaskElement = rt;
	var at = ["mask"],
		ut = (function () {
			function t(e, n) {
				f(this, t),
					(this.el =
						e instanceof it
							? e
							: e.isContentEditable &&
								"INPUT" !== e.tagName &&
								"TEXTAREA" !== e.tagName
								? new rt(e)
								: new st(e)),
					(this.masked = N(n)),
					(this._listeners = {}),
					(this._value = ""),
					(this._unmaskedValue = ""),
					(this._saveSelection = this._saveSelection.bind(this)),
					(this._onInput = this._onInput.bind(this)),
					(this._onChange = this._onChange.bind(this)),
					(this._onDrop = this._onDrop.bind(this)),
					(this._onFocus = this._onFocus.bind(this)),
					(this._onClick = this._onClick.bind(this)),
					(this.alignCursor = this.alignCursor.bind(this)),
					(this.alignCursorFriendly = this.alignCursorFriendly.bind(this)),
					this._bindEvents(),
					this.updateValue(),
					this._onChange();
			}
			return (
				g(t, [
					{
						key: "mask",
						get: function () {
							return this.masked.mask;
						},
						set: function (t) {
							if (!this.maskEquals(t))
								if (t instanceof q.Masked || this.masked.constructor !== H(t)) {
									var e = N({ mask: t });
									(e.unmaskedValue = this.masked.unmaskedValue),
										(this.masked = e);
								} else this.masked.updateOptions({ mask: t });
						},
					},
					{
						key: "maskEquals",
						value: function (t) {
							return (
								null == t ||
								t === this.masked.mask ||
								(t === Date && this.masked instanceof nt)
							);
						},
					},
					{
						key: "value",
						get: function () {
							return this._value;
						},
						set: function (t) {
							(this.masked.value = t), this.updateControl(), this.alignCursor();
						},
					},
					{
						key: "unmaskedValue",
						get: function () {
							return this._unmaskedValue;
						},
						set: function (t) {
							(this.masked.unmaskedValue = t),
								this.updateControl(),
								this.alignCursor();
						},
					},
					{
						key: "typedValue",
						get: function () {
							return this.masked.typedValue;
						},
						set: function (t) {
							(this.masked.typedValue = t),
								this.updateControl(),
								this.alignCursor();
						},
					},
					{
						key: "_bindEvents",
						value: function () {
							this.el.bindEvents({
								selectionChange: this._saveSelection,
								input: this._onInput,
								drop: this._onDrop,
								click: this._onClick,
								focus: this._onFocus,
								commit: this._onChange,
							});
						},
					},
					{
						key: "_unbindEvents",
						value: function () {
							this.el && this.el.unbindEvents();
						},
					},
					{
						key: "_fireEvent",
						value: function (t) {
							for (
								var e = arguments.length,
								n = new Array(e > 1 ? e - 1 : 0),
								i = 1;
								i < e;
								i++
							)
								n[i - 1] = arguments[i];
							var s = this._listeners[t];
							s &&
								s.forEach(function (t) {
									return t.apply(void 0, n);
								});
						},
					},
					{
						key: "selectionStart",
						get: function () {
							return this._cursorChanging
								? this._changingCursorPos
								: this.el.selectionStart;
						},
					},
					{
						key: "cursorPos",
						get: function () {
							return this._cursorChanging
								? this._changingCursorPos
								: this.el.selectionEnd;
						},
						set: function (t) {
							this.el &&
								this.el.isActive &&
								(this.el.select(t, t), this._saveSelection());
						},
					},
					{
						key: "_saveSelection",
						value: function () {
							this.value !== this.el.value &&
								console.warn(
									"Element value was changed outside of mask. Syncronize mask using `mask.updateValue()` to work properly."
								),
								(this._selection = {
									start: this.selectionStart,
									end: this.cursorPos,
								});
						},
					},
					{
						key: "updateValue",
						value: function () {
							(this.masked.value = this.el.value),
								(this._value = this.masked.value);
						},
					},
					{
						key: "updateControl",
						value: function () {
							var t = this.masked.unmaskedValue,
								e = this.masked.value,
								n = this.unmaskedValue !== t || this.value !== e;
							(this._unmaskedValue = t),
								(this._value = e),
								this.el.value !== e && (this.el.value = e),
								n && this._fireChangeEvents();
						},
					},
					{
						key: "updateOptions",
						value: function (t) {
							var e = t.mask,
								n = _(t, at),
								i = !this.maskEquals(e),
								s = !R(this.masked, n);
							i && (this.mask = e),
								s && this.masked.updateOptions(n),
								(i || s) && this.updateControl();
						},
					},
					{
						key: "updateCursor",
						value: function (t) {
							null != t && ((this.cursorPos = t), this._delayUpdateCursor(t));
						},
					},
					{
						key: "_delayUpdateCursor",
						value: function (t) {
							var e = this;
							this._abortUpdateCursor(),
								(this._changingCursorPos = t),
								(this._cursorChanging = setTimeout(function () {
									e.el &&
										((e.cursorPos = e._changingCursorPos),
											e._abortUpdateCursor());
								}, 10));
						},
					},
					{
						key: "_fireChangeEvents",
						value: function () {
							this._fireEvent("accept", this._inputEvent),
								this.masked.isComplete &&
								this._fireEvent("complete", this._inputEvent);
						},
					},
					{
						key: "_abortUpdateCursor",
						value: function () {
							this._cursorChanging &&
								(clearTimeout(this._cursorChanging),
									delete this._cursorChanging);
						},
					},
					{
						key: "alignCursor",
						value: function () {
							this.cursorPos = this.masked.nearestInputPos(this.cursorPos, O);
						},
					},
					{
						key: "alignCursorFriendly",
						value: function () {
							this.selectionStart === this.cursorPos && this.alignCursor();
						},
					},
					{
						key: "on",
						value: function (t, e) {
							return (
								this._listeners[t] || (this._listeners[t] = []),
								this._listeners[t].push(e),
								this
							);
						},
					},
					{
						key: "off",
						value: function (t, e) {
							if (!this._listeners[t]) return this;
							if (!e) return delete this._listeners[t], this;
							var n = this._listeners[t].indexOf(e);
							return n >= 0 && this._listeners[t].splice(n, 1), this;
						},
					},
					{
						key: "_onInput",
						value: function (t) {
							if (
								((this._inputEvent = t),
									this._abortUpdateCursor(),
									!this._selection)
							)
								return this.updateValue();
							var e = new V(
								this.el.value,
								this.cursorPos,
								this.value,
								this._selection
							),
								n = this.masked.rawInputValue,
								i = this.masked.splice(
									e.startChangePos,
									e.removed.length,
									e.inserted,
									e.removeDirection
								).offset,
								s = n === this.masked.rawInputValue ? e.removeDirection : x,
								r = this.masked.nearestInputPos(e.startChangePos + i, s);
							this.updateControl(),
								this.updateCursor(r),
								delete this._inputEvent;
						},
					},
					{
						key: "_onChange",
						value: function () {
							this.value !== this.el.value && this.updateValue(),
								this.masked.doCommit(),
								this.updateControl(),
								this._saveSelection();
						},
					},
					{
						key: "_onDrop",
						value: function (t) {
							t.preventDefault(), t.stopPropagation();
						},
					},
					{
						key: "_onFocus",
						value: function (t) {
							this.alignCursorFriendly();
						},
					},
					{
						key: "_onClick",
						value: function (t) {
							this.alignCursorFriendly();
						},
					},
					{
						key: "destroy",
						value: function () {
							this._unbindEvents(),
								(this._listeners.length = 0),
								delete this.el;
						},
					},
				]),
				t
			);
		})();
	q.InputMask = ut;
	var ot = (function (t) {
		m(n, t);
		var e = b(n);
		function n() {
			return f(this, n), e.apply(this, arguments);
		}
		return (
			g(n, [
				{
					key: "_update",
					value: function (t) {
						t.enum && (t.mask = "*".repeat(t.enum[0].length)),
							C(k(n.prototype), "_update", this).call(this, t);
					},
				},
				{
					key: "doValidate",
					value: function () {
						for (
							var t, e = this, i = arguments.length, s = new Array(i), r = 0;
							r < i;
							r++
						)
							s[r] = arguments[r];
						return (
							this.enum.some(function (t) {
								return t.indexOf(e.unmaskedValue) >= 0;
							}) &&
							(t = C(k(n.prototype), "doValidate", this)).call.apply(
								t,
								[this].concat(s)
							)
						);
					},
				},
			]),
			n
		);
	})(J);
	q.MaskedEnum = ot;
	var lt = (function (t) {
		m(n, t);
		var e = b(n);
		function n(t) {
			return f(this, n), e.call(this, Object.assign({}, n.DEFAULTS, t));
		}
		return (
			g(n, [
				{
					key: "_update",
					value: function (t) {
						C(k(n.prototype), "_update", this).call(this, t),
							this._updateRegExps();
					},
				},
				{
					key: "_updateRegExps",
					value: function () {
						var t = "^" + (this.allowNegative ? "[+|\\-]?" : ""),
							e =
								(this.scale
									? "(" + I(this.radix) + "\\d{0," + this.scale + "})?"
									: "") + "$";
						(this._numberRegExpInput = new RegExp(t + "(0|([1-9]+\\d*))?" + e)),
							(this._numberRegExp = new RegExp(t + "\\d*" + e)),
							(this._mapToRadixRegExp = new RegExp(
								"[" + this.mapToRadix.map(I).join("") + "]",
								"g"
							)),
							(this._thousandsSeparatorRegExp = new RegExp(
								I(this.thousandsSeparator),
								"g"
							));
					},
				},
				{
					key: "_removeThousandsSeparators",
					value: function (t) {
						return t.replace(this._thousandsSeparatorRegExp, "");
					},
				},
				{
					key: "_insertThousandsSeparators",
					value: function (t) {
						var e = t.split(this.radix);
						return (
							(e[0] = e[0].replace(
								/\B(?=(\d{3})+(?!\d))/g,
								this.thousandsSeparator
							)),
							e.join(this.radix)
						);
					},
				},
				{
					key: "doPrepare",
					value: function (t) {
						for (
							var e,
							i = arguments.length,
							s = new Array(i > 1 ? i - 1 : 0),
							r = 1;
							r < i;
							r++
						)
							s[r - 1] = arguments[r];
						return (e = C(k(n.prototype), "doPrepare", this)).call.apply(
							e,
							[
								this,
								this._removeThousandsSeparators(
									t.replace(this._mapToRadixRegExp, this.radix)
								),
							].concat(s)
						);
					},
				},
				{
					key: "_separatorsCount",
					value: function (t) {
						for (
							var e =
								arguments.length > 1 &&
								void 0 !== arguments[1] &&
								arguments[1],
							n = 0,
							i = 0;
							i < t;
							++i
						)
							this._value.indexOf(this.thousandsSeparator, i) === i &&
								(++n, e && (t += this.thousandsSeparator.length));
						return n;
					},
				},
				{
					key: "_separatorsCountFromSlice",
					value: function () {
						var t =
							arguments.length > 0 && void 0 !== arguments[0]
								? arguments[0]
								: this._value;
						return this._separatorsCount(
							this._removeThousandsSeparators(t).length,
							!0
						);
					},
				},
				{
					key: "extractInput",
					value: function () {
						var t =
							arguments.length > 0 && void 0 !== arguments[0]
								? arguments[0]
								: 0,
							e =
								arguments.length > 1 && void 0 !== arguments[1]
									? arguments[1]
									: this.value.length,
							i = arguments.length > 2 ? arguments[2] : void 0,
							s = this._adjustRangeWithSeparators(t, e),
							r = F(s, 2);
						return (
							(t = r[0]),
							(e = r[1]),
							this._removeThousandsSeparators(
								C(k(n.prototype), "extractInput", this).call(this, t, e, i)
							)
						);
					},
				},
				{
					key: "_appendCharRaw",
					value: function (t) {
						var e =
							arguments.length > 1 && void 0 !== arguments[1]
								? arguments[1]
								: {};
						if (!this.thousandsSeparator)
							return C(k(n.prototype), "_appendCharRaw", this).call(this, t, e);
						var i =
							e.tail && e._beforeTailState
								? e._beforeTailState._value
								: this._value,
							s = this._separatorsCountFromSlice(i);
						this._value = this._removeThousandsSeparators(this.value);
						var r = C(k(n.prototype), "_appendCharRaw", this).call(this, t, e);
						this._value = this._insertThousandsSeparators(this._value);
						var a =
							e.tail && e._beforeTailState
								? e._beforeTailState._value
								: this._value,
							u = this._separatorsCountFromSlice(a);
						return (
							(r.tailShift += (u - s) * this.thousandsSeparator.length),
							(r.skip = !r.rawInserted && t === this.thousandsSeparator),
							r
						);
					},
				},
				{
					key: "_findSeparatorAround",
					value: function (t) {
						if (this.thousandsSeparator) {
							var e = t - this.thousandsSeparator.length + 1,
								n = this.value.indexOf(this.thousandsSeparator, e);
							if (n <= t) return n;
						}
						return -1;
					},
				},
				{
					key: "_adjustRangeWithSeparators",
					value: function (t, e) {
						var n = this._findSeparatorAround(t);
						n >= 0 && (t = n);
						var i = this._findSeparatorAround(e);
						return i >= 0 && (e = i + this.thousandsSeparator.length), [t, e];
					},
				},
				{
					key: "remove",
					value: function () {
						var t =
							arguments.length > 0 && void 0 !== arguments[0]
								? arguments[0]
								: 0,
							e =
								arguments.length > 1 && void 0 !== arguments[1]
									? arguments[1]
									: this.value.length,
							n = this._adjustRangeWithSeparators(t, e),
							i = F(n, 2);
						(t = i[0]), (e = i[1]);
						var s = this.value.slice(0, t),
							r = this.value.slice(e),
							a = this._separatorsCount(s.length);
						this._value = this._insertThousandsSeparators(
							this._removeThousandsSeparators(s + r)
						);
						var u = this._separatorsCountFromSlice(s);
						return new j({
							tailShift: (u - a) * this.thousandsSeparator.length,
						});
					},
				},
				{
					key: "nearestInputPos",
					value: function (t, e) {
						if (!this.thousandsSeparator) return t;
						switch (e) {
							case x:
							case O:
							case M:
								var n = this._findSeparatorAround(t - 1);
								if (n >= 0) {
									var i = n + this.thousandsSeparator.length;
									if (t < i || this.value.length <= i || e === M) return n;
								}
								break;
							case L:
							case P:
								var s = this._findSeparatorAround(t);
								if (s >= 0) return s + this.thousandsSeparator.length;
						}
						return t;
					},
				},
				{
					key: "doValidate",
					value: function (t) {
						var e = (
							t.input ? this._numberRegExpInput : this._numberRegExp
						).test(this._removeThousandsSeparators(this.value));
						if (e) {
							var i = this.number;
							e =
								e &&
								!isNaN(i) &&
								(null == this.min ||
									this.min >= 0 ||
									this.min <= this.number) &&
								(null == this.max || this.max <= 0 || this.number <= this.max);
						}
						return e && C(k(n.prototype), "doValidate", this).call(this, t);
					},
				},
				{
					key: "doCommit",
					value: function () {
						if (this.value) {
							var t = this.number,
								e = t;
							null != this.min && (e = Math.max(e, this.min)),
								null != this.max && (e = Math.min(e, this.max)),
								e !== t && (this.unmaskedValue = String(e));
							var i = this.value;
							this.normalizeZeros && (i = this._normalizeZeros(i)),
								this.padFractionalZeros && (i = this._padFractionalZeros(i)),
								(this._value = i);
						}
						C(k(n.prototype), "doCommit", this).call(this);
					},
				},
				{
					key: "_normalizeZeros",
					value: function (t) {
						var e = this._removeThousandsSeparators(t).split(this.radix);
						return (
							(e[0] = e[0].replace(/^(\D*)(0*)(\d*)/, function (t, e, n, i) {
								return e + i;
							})),
							t.length && !/\d$/.test(e[0]) && (e[0] = e[0] + "0"),
							e.length > 1 &&
							((e[1] = e[1].replace(/0*$/, "")),
								e[1].length || (e.length = 1)),
							this._insertThousandsSeparators(e.join(this.radix))
						);
					},
				},
				{
					key: "_padFractionalZeros",
					value: function (t) {
						if (!t) return t;
						var e = t.split(this.radix);
						return (
							e.length < 2 && e.push(""),
							(e[1] = e[1].padEnd(this.scale, "0")),
							e.join(this.radix)
						);
					},
				},
				{
					key: "unmaskedValue",
					get: function () {
						return this._removeThousandsSeparators(
							this._normalizeZeros(this.value)
						).replace(this.radix, ".");
					},
					set: function (t) {
						w(
							k(n.prototype),
							"unmaskedValue",
							t.replace(".", this.radix),
							this,
							!0
						);
					},
				},
				{
					key: "typedValue",
					get: function () {
						return Number(this.unmaskedValue);
					},
					set: function (t) {
						w(k(n.prototype), "unmaskedValue", String(t), this, !0);
					},
				},
				{
					key: "number",
					get: function () {
						return this.typedValue;
					},
					set: function (t) {
						this.typedValue = t;
					},
				},
				{
					key: "allowNegative",
					get: function () {
						return (
							this.signed ||
							(null != this.min && this.min < 0) ||
							(null != this.max && this.max < 0)
						);
					},
				},
			]),
			n
		);
	})(W);
	(lt.DEFAULTS = {
		radix: ",",
		thousandsSeparator: "",
		mapToRadix: ["."],
		scale: 2,
		signed: !1,
		normalizeZeros: !0,
		padFractionalZeros: !1,
	}),
		(q.MaskedNumber = lt);
	var ht = (function (t) {
		m(n, t);
		var e = b(n);
		function n() {
			return f(this, n), e.apply(this, arguments);
		}
		return (
			g(n, [
				{
					key: "_update",
					value: function (t) {
						t.mask && (t.validate = t.mask),
							C(k(n.prototype), "_update", this).call(this, t);
					},
				},
			]),
			n
		);
	})(W);
	q.MaskedFunction = ht;
	var ct = ["compiledMasks", "currentMaskRef", "currentMask"],
		dt = (function (t) {
			m(n, t);
			var e = b(n);
			function n(t) {
				var i;
				return (
					f(this, n),
					((i = e.call(this, Object.assign({}, n.DEFAULTS, t))).currentMask =
						null),
					i
				);
			}
			return (
				g(n, [
					{
						key: "_update",
						value: function (t) {
							C(k(n.prototype), "_update", this).call(this, t),
								"mask" in t &&
								(this.compiledMasks = Array.isArray(t.mask)
									? t.mask.map(function (t) {
										return N(t);
									})
									: []);
						},
					},
					{
						key: "_appendCharRaw",
						value: function (t) {
							var e =
								arguments.length > 1 && void 0 !== arguments[1]
									? arguments[1]
									: {},
								n = this._applyDispatch(t, e);
							return (
								this.currentMask &&
								n.aggregate(this.currentMask._appendChar(t, e)),
								n
							);
						},
					},
					{
						key: "_applyDispatch",
						value: function () {
							var t =
								arguments.length > 0 && void 0 !== arguments[0]
									? arguments[0]
									: "",
								e =
									arguments.length > 1 && void 0 !== arguments[1]
										? arguments[1]
										: {},
								n =
									e.tail && null != e._beforeTailState
										? e._beforeTailState._value
										: this.value,
								i = this.rawInputValue,
								s =
									e.tail && null != e._beforeTailState
										? e._beforeTailState._rawInputValue
										: i,
								r = i.slice(s.length),
								a = this.currentMask,
								u = new j(),
								o = a && a.state;
							if (
								((this.currentMask = this.doDispatch(t, Object.assign({}, e))),
									this.currentMask)
							)
								if (this.currentMask !== a) {
									if ((this.currentMask.reset(), s)) {
										var l = this.currentMask.append(s, { raw: !0 });
										u.tailShift = l.inserted.length - n.length;
									}
									r &&
										(u.tailShift += this.currentMask.append(r, {
											raw: !0,
											tail: !0,
										}).tailShift);
								} else this.currentMask.state = o;
							return u;
						},
					},
					{
						key: "_appendPlaceholder",
						value: function () {
							var t = this._applyDispatch.apply(this, arguments);
							return (
								this.currentMask &&
								t.aggregate(this.currentMask._appendPlaceholder()),
								t
							);
						},
					},
					{
						key: "doDispatch",
						value: function (t) {
							var e =
								arguments.length > 1 && void 0 !== arguments[1]
									? arguments[1]
									: {};
							return this.dispatch(t, this, e);
						},
					},
					{
						key: "doValidate",
						value: function () {
							for (
								var t, e, i = arguments.length, s = new Array(i), r = 0;
								r < i;
								r++
							)
								s[r] = arguments[r];
							return (
								(t = C(k(n.prototype), "doValidate", this)).call.apply(
									t,
									[this].concat(s)
								) &&
								(!this.currentMask ||
									(e = this.currentMask).doValidate.apply(e, s))
							);
						},
					},
					{
						key: "reset",
						value: function () {
							this.currentMask && this.currentMask.reset(),
								this.compiledMasks.forEach(function (t) {
									return t.reset();
								});
						},
					},
					{
						key: "value",
						get: function () {
							return this.currentMask ? this.currentMask.value : "";
						},
						set: function (t) {
							w(k(n.prototype), "value", t, this, !0);
						},
					},
					{
						key: "unmaskedValue",
						get: function () {
							return this.currentMask ? this.currentMask.unmaskedValue : "";
						},
						set: function (t) {
							w(k(n.prototype), "unmaskedValue", t, this, !0);
						},
					},
					{
						key: "typedValue",
						get: function () {
							return this.currentMask ? this.currentMask.typedValue : "";
						},
						set: function (t) {
							var e = String(t);
							this.currentMask &&
								((this.currentMask.typedValue = t),
									(e = this.currentMask.unmaskedValue)),
								(this.unmaskedValue = e);
						},
					},
					{
						key: "isComplete",
						get: function () {
							return !!this.currentMask && this.currentMask.isComplete;
						},
					},
					{
						key: "remove",
						value: function () {
							var t,
								e = new j();
							this.currentMask &&
								e
									.aggregate((t = this.currentMask).remove.apply(t, arguments))
									.aggregate(this._applyDispatch());
							return e;
						},
					},
					{
						key: "state",
						get: function () {
							return Object.assign({}, C(k(n.prototype), "state", this), {
								_rawInputValue: this.rawInputValue,
								compiledMasks: this.compiledMasks.map(function (t) {
									return t.state;
								}),
								currentMaskRef: this.currentMask,
								currentMask: this.currentMask && this.currentMask.state,
							});
						},
						set: function (t) {
							var e = t.compiledMasks,
								i = t.currentMaskRef,
								s = t.currentMask,
								r = _(t, ct);
							this.compiledMasks.forEach(function (t, n) {
								return (t.state = e[n]);
							}),
								null != i &&
								((this.currentMask = i), (this.currentMask.state = s)),
								w(k(n.prototype), "state", r, this, !0);
						},
					},
					{
						key: "extractInput",
						value: function () {
							var t;
							return this.currentMask
								? (t = this.currentMask).extractInput.apply(t, arguments)
								: "";
						},
					},
					{
						key: "extractTail",
						value: function () {
							for (
								var t, e, i = arguments.length, s = new Array(i), r = 0;
								r < i;
								r++
							)
								s[r] = arguments[r];
							return this.currentMask
								? (t = this.currentMask).extractTail.apply(t, s)
								: (e = C(k(n.prototype), "extractTail", this)).call.apply(
									e,
									[this].concat(s)
								);
						},
					},
					{
						key: "doCommit",
						value: function () {
							this.currentMask && this.currentMask.doCommit(),
								C(k(n.prototype), "doCommit", this).call(this);
						},
					},
					{
						key: "nearestInputPos",
						value: function () {
							for (
								var t, e, i = arguments.length, s = new Array(i), r = 0;
								r < i;
								r++
							)
								s[r] = arguments[r];
							return this.currentMask
								? (t = this.currentMask).nearestInputPos.apply(t, s)
								: (e = C(k(n.prototype), "nearestInputPos", this)).call.apply(
									e,
									[this].concat(s)
								);
						},
					},
					{
						key: "overwrite",
						get: function () {
							return this.currentMask
								? this.currentMask.overwrite
								: C(k(n.prototype), "overwrite", this);
						},
						set: function (t) {
							console.warn(
								'"overwrite" option is not available in dynamic mask, use this option in siblings'
							);
						},
					},
				]),
				n
			);
		})(W);
	(dt.DEFAULTS = {
		dispatch: function (t, e, n) {
			if (e.compiledMasks.length) {
				var i = e.rawInputValue,
					s = e.compiledMasks.map(function (e, s) {
						return (
							e.reset(),
							e.append(i, { raw: !0 }),
							e.append(t, n),
							{ weight: e.rawInputValue.length, index: s }
						);
					});
				return (
					s.sort(function (t, e) {
						return e.weight - t.weight;
					}),
					e.compiledMasks[s[0].index]
				);
			}
		},
	}),
		(q.MaskedDynamic = dt);
	var pt = { MASKED: "value", UNMASKED: "unmaskedValue", TYPED: "typedValue" };
	function ft(t) {
		var e =
			arguments.length > 1 && void 0 !== arguments[1]
				? arguments[1]
				: pt.MASKED,
			n =
				arguments.length > 2 && void 0 !== arguments[2]
					? arguments[2]
					: pt.MASKED,
			i = N(t);
		return function (t) {
			return i.runIsolated(function (i) {
				return (i[e] = t), i[n];
			});
		};
	}
	(q.PIPE_TYPE = pt),
		(q.createPipe = ft),
		(q.pipe = function (t) {
			for (
				var e = arguments.length, n = new Array(e > 1 ? e - 1 : 0), i = 1;
				i < e;
				i++
			)
				n[i - 1] = arguments[i];
			return ft.apply(void 0, n)(t);
		});
	try {
		globalThis.IMask = q;
	} catch (t) { }
	const vt = document.documentElement;
	document.addEventListener("click", function (t) {
		!t.target.closest(".header__menu") &&
			innerWidth < 767.5 &&
			(vt.classList.remove("menu-open"), vt.classList.remove("lock"));
	});
	let gt = document.getElementsByClassName("item-events__button");
	console.log(gt);
	let mt;
	gt.innerHTML;
	window.addEventListener("resize", function () {
		if (gt && innerWidth < 767.5)
			for (let t = 0; t < gt.length; t++)
				innerWidth < 767.5 && ((mt = "+"), (gt[t].innerHTML = "+"));
		else
			for (let t = 0; t < gt.length; t++)
				if (innerWidth > 767.5) {
					let e = "Учавствовать";
					gt[t].innerHTML = e;
				}
	});
	const kt = document.querySelector(".item-events_1");
	document.addEventListener("click", function (t) {
		t.target.closest(".item-events_1") &&
			innerWidth < 991.5 &&
			innerWidth > 767.5 &&
			kt.classList.toggle("_show-card");
		t.target.closest(".item-events_1") || kt.classList.remove("_show-card");
	});
	const yt = document.querySelector(".item-events_2");
	document.addEventListener("click", function (t) {
		t.target.closest(".item-events_2") &&
			innerWidth < 991.5 &&
			innerWidth > 767.5 &&
			yt.classList.toggle("_show-card");
		t.target.closest(".item-events_2") || yt.classList.remove("_show-card");
	});
	const _t = document.querySelector(".item-events_3");
	document.addEventListener("click", function (t) {
		t.target.closest(".item-events_3") &&
			innerWidth < 991.5 &&
			innerWidth > 767.5 &&
			_t.classList.toggle("_show-card");
		t.target.closest(".item-events_3") || _t.classList.remove("_show-card");
	});
	new q(document.getElementById("phoneNumber"), { mask: "+{7}(000)000-00-00" });
	const At = document.querySelector(".item-schedule_1");
	document.addEventListener("click", function (t) {
		t.target.closest(".item-schedule_1") && At.classList.toggle("_description");
		t.target.closest(".item-schedule_1") || At.classList.remove("_description");
	});
	const bt = document.querySelector(".item-schedule_2");
	document.addEventListener("click", function (t) {
		t.target.closest(".item-schedule_2") && bt.classList.toggle("_description");
		t.target.closest(".item-schedule_2") || bt.classList.remove("_description");
	});
	const Et = document.querySelector(".item-schedule_3");
	document.addEventListener("click", function (t) {
		t.target.closest(".item-schedule_3") && Et.classList.toggle("_description");
		t.target.closest(".item-schedule_3") || Et.classList.remove("_description");
	});
	const Ct = document.querySelector(".item-schedule_4");
	document.addEventListener("click", function (t) {
		t.target.closest(".item-schedule_4") && Ct.classList.toggle("_description");
		t.target.closest(".item-schedule_4") || Ct.classList.remove("_description");
	});
	const St = document.querySelector(".item-schedule_5");
	document.addEventListener("click", function (t) {
		t.target.closest(".item-schedule_5") && St.classList.toggle("_description");
		t.target.closest(".item-schedule_5") || St.classList.remove("_description");
	});
	const wt = document.querySelector(".item-schedule_6");
	function Ft(t) {
		let e = 30;
		switch (t.target.dataset.type) {
			case "shadow":
			case "line":
				e = 60;
		}
		if (0 === t.clientX && 0 === t.clientY) {
			const e = t.target.getBoundingClientRect(),
				n = e.left + e.width / 2,
				i = e.top + e.height / 2;
			for (let e = 0; e < 30; e++) Bt(n, i, t.target.dataset.type);
		} else
			for (let n = 0; n < e; n++)
				Bt(t.clientX, t.clientY, t.target.dataset.type);
	}
	function Bt(t, e, n) {
		const i = document.createElement("particle");
		document.body.appendChild(i);
		let s = Math.floor(30 * Math.random() + 8),
			r = s,
			a = 300 * (Math.random() - 0.5),
			u = 300 * (Math.random() - 0.5),
			o = 520 * Math.random(),
			l = 200 * Math.random();
		switch (n) {
			case "square":
				(i.style.background = `hsl(${50 * Math.random() + 200}, 70%, 60%)`),
					(i.style.border = "1px solid white");
				break;
			case "symbol":
				(i.innerHTML = [
					"&#9884;",
					"&#9731;",
					"&#10084;",
					"&#10052;",
					"&#10054;",
					"&#9733;",
					"&#9787;",
				][Math.floor(7 * Math.random())]),
					(i.style.color = `hsl(${50 * Math.random() + 200}, 70%, 60%)`),
					(i.style.fontSize = 24 * Math.random() + 10 + "px"),
					(s = r = "auto");
				break;
			case "logo":
				i.style.backgroundImage = "url(../img/icons/logo.svg)";
				break;
			case "shadow":
				var h = `hsl(${50 * Math.random() + 200}, 70%, 50%)`;
				(i.style.boxShadow = `0 0 ${Math.floor(
					10 * Math.random() + 10
				)}px ${h}`),
					(i.style.background = h),
					(i.style.borderRadius = "50%"),
					(s = r = 5 * Math.random() + 4);
				break;
			case "line":
				(i.style.background = `hsl(${50 * Math.random() + 200}, 70%, 50%)`),
					(r = 1),
					(o += 1e3),
					(l = 1e3 * Math.random());
		}
		(i.style.width = `${s}px`), (i.style.height = `${r}px`);
		i.animate(
			[
				{
					transform: `translate(-50%, -50%) translate(${t}px, ${e}px) rotate(0deg)`,
					opacity: 1,
				},
				{
					transform: `translate(-50%, -50%) translate(${t + a}px, ${e + u
						}px) rotate(${o}deg)`,
					opacity: 0,
				},
			],
			{
				duration: 1e3 * Math.random() + 5e3,
				easing: "cubic-bezier(0, .9, .57, 1)",
				delay: l,
			}
		).onfinish = Dt;
	}
	function Dt(t) {
		t.srcElement.effect.target.remove();
	}
	document.addEventListener("click", function (t) {
		t.target.closest(".item-schedule_6") && wt.classList.toggle("_description");
		t.target.closest(".item-schedule_6") || wt.classList.remove("_description");
	}),
		document.body.animate &&
		document
			.querySelectorAll(".btn")
			.forEach((t) => t.addEventListener("click", Ft)),
		(window.FLS = !0),
		(function (t) {
			let e = new Image();
			(e.onload = e.onerror =
				function () {
					t(2 == e.height);
				}),
				(e.src =
					"data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA");
		})(function (t) {
			let e = !0 === t ? "webp" : "no-webp";
			document.documentElement.classList.add(e);
		}),
		e.any() && document.documentElement.classList.add("touch"),
		(function () {
			let t = document.querySelector(".icon-menu");
			t &&
				t.addEventListener("click", function (t) {
					i && (s(), document.documentElement.classList.toggle("menu-open"));
				});
		})(),
		(function () {
			if (document.querySelectorAll("[data-fullscreen]").length && e.any()) {
				function t() {
					let t = 0.01 * window.innerHeight;
					document.documentElement.style.setProperty("--vh", `${t}px`);
				}
				window.addEventListener("resize", t), t();
			}
		})(),
		(function () {
			const t = document.querySelectorAll(
				"input[placeholder],textarea[placeholder]"
			);
			t.length &&
				t.forEach((t) => {
					t.dataset.placeholder = t.placeholder;
				}),
				document.body.addEventListener("focusin", function (t) {
					const e = t.target;
					("INPUT" !== e.tagName && "TEXTAREA" !== e.tagName) ||
						(e.dataset.placeholder && (e.placeholder = ""),
							e.classList.add("_form-focus"),
							e.parentElement.classList.add("_form-focus"),
							h.removeError(e));
				}),
				document.body.addEventListener("focusout", function (t) {
					const e = t.target;
					("INPUT" !== e.tagName && "TEXTAREA" !== e.tagName) ||
						(e.dataset.placeholder && (e.placeholder = e.dataset.placeholder),
							e.classList.remove("_form-focus"),
							e.parentElement.classList.remove("_form-focus"),
							e.hasAttribute("data-validate") && h.validateInput(e));
				});
		})(),
		(function (e) {
			t.popup && t.popup.open("some");
			const n = document.forms;
			if (n.length)
				for (const t of n)
					t.addEventListener("submit", function (t) {
						i(t.target, t);
					}),
						t.addEventListener("reset", function (t) {
							const e = t.target;
							h.formClean(e);
						});
			async function i(t, n) {
				if (0 === (e ? h.getErrors(t) : 0)) {
					if (t.hasAttribute("data-ajax")) {
						n.preventDefault();
						const e = t.getAttribute("action")
							? t.getAttribute("action").trim()
							: "#",
							i = t.getAttribute("method")
								? t.getAttribute("method").trim()
								: "GET",
							r = new FormData(t);
						t.classList.add("_sending");
						const a = await fetch(e, { method: i, body: r });
						if (a.ok) {
							await a.json();
							t.classList.remove("_sending"), s(t);
						} else alert("Ошибка"), t.classList.remove("_sending");
					} else t.hasAttribute("data-dev") && (n.preventDefault(), s(t));
				} else {
					n.preventDefault();
					const e = t.querySelector("._form-error");
					e && t.hasAttribute("data-goto-error") && l(e, !0, 1e3);
				}
			}
			function s(e) {
				document.dispatchEvent(
					new CustomEvent("formSent", { detail: { form: e } })
				),
					setTimeout(() => {
						if (t.popup) {
							const n = e.dataset.popupMessage;
							n && t.popup.open(n);
						}
					}, 0),
					h.formClean(e),
					u(`[Формы]: ${"Форма отправлена!"}`);
			}
		})(!0),
		(function () {
			function t(t) {
				if ("click" === t.type) {
					const e = t.target;
					if (e.closest("[data-goto]")) {
						const n = e.closest("[data-goto]"),
							i = n.dataset.goto ? n.dataset.goto : "",
							s = !!n.hasAttribute("data-goto-header"),
							r = n.dataset.gotoSpeed ? n.dataset.gotoSpeed : 500,
							a = n.dataset.gotoTop ? parseInt(n.dataset.gotoTop) : 0;
						l(i, s, r, a), t.preventDefault();
					}
				} else if ("watcherCallback" === t.type && t.detail) {
					const e = t.detail.entry,
						n = e.target;
					if ("navigator" === n.dataset.watch) {
						document.querySelector("[data-goto]._navigator-active");
						let t;
						if (n.id && document.querySelector(`[data-goto="#${n.id}"]`))
							t = document.querySelector(`[data-goto="#${n.id}"]`);
						else if (n.classList.length)
							for (let e = 0; e < n.classList.length; e++) {
								const i = n.classList[e];
								if (document.querySelector(`[data-goto=".${i}"]`)) {
									t = document.querySelector(`[data-goto=".${i}"]`);
									break;
								}
							}
						e.isIntersecting
							? t && t.classList.add("_navigator-active")
							: t && t.classList.remove("_navigator-active");
					}
				}
			}
			if (
				(document.addEventListener("click", t),
					document.addEventListener("watcherCallback", t),
					n())
			) {
				let t;
				document.querySelector(`#${n()}`)
					? (t = `#${n()}`)
					: document.querySelector(`.${n()}`) && (t = `.${n()}`),
					t && l(t, !0, 500, 20);
			}
		})();
})();
