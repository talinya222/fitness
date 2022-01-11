(() => {
  "use strict";
  const e = {};
  let t = !0,
    r = (e = 500) => {
      let r = document.querySelector("body");
      if (t) {
        let o = document.querySelectorAll("[data-lp]");
        setTimeout(() => {
          for (let e = 0; e < o.length; e++) {
            o[e].style.paddingRight = "0px";
          }
          (r.style.paddingRight = "0px"),
            document.documentElement.classList.remove("lock");
        }, e),
          (t = !1),
          setTimeout(function () {
            t = !0;
          }, e);
      }
    },
    o = (e = 500) => {
      let r = document.querySelector("body");
      if (t) {
        let o = document.querySelectorAll("[data-lp]");
        for (let e = 0; e < o.length; e++) {
          o[e].style.paddingRight =
            window.innerWidth -
            document.querySelector(".wrapper").offsetWidth +
            "px";
        }
        (r.style.paddingRight =
          window.innerWidth -
          document.querySelector(".wrapper").offsetWidth +
          "px"),
          document.documentElement.classList.add("lock"),
          (t = !1),
          setTimeout(function () {
            t = !0;
          }, e);
      }
    };
  function a(e) {
    setTimeout(() => {
      window.FLS && console.log(e);
    }, 0);
  }
  function n(e) {
    return e.filter(function (e, t, r) {
      return r.indexOf(e) === t;
    });
  }
  let s = (e, t = !1, o = 500, n = 0) => {
    const s = "string" == typeof e ? document.querySelector(e) : e;
    if (s) {
      let c = "",
        l = 0;
      t &&
        ((c = "header.header"), (l = document.querySelector(c).offsetHeight));
      let i = {
        speedAsDuration: !0,
        speed: o,
        header: c,
        offset: n,
        easing: "easeOutQuad",
      };
      if (
        (document.documentElement.classList.contains("menu-open") &&
          (r(), document.documentElement.classList.remove("menu-open")),
        "undefined" != typeof SmoothScroll)
      )
        new SmoothScroll().animateScroll(s, "", i);
      else {
        let e = s.getBoundingClientRect().top + scrollY;
        window.scrollTo({ top: l ? e - l : e, behavior: "smooth" });
      }
      a(`[gotoBlock]: Юхуу...едем к ${e}`);
    } else a(`[gotoBlock]: Ой ой..Такого блока нет на странице: ${e}`);
  };
  let c = {
    getErrors(e) {
      let t = 0,
        r = e.querySelectorAll("*[data-required]");
      return (
        r.length &&
          r.forEach((e) => {
            (null === e.offsetParent && "SELECT" !== e.tagName) ||
              e.disabled ||
              (t += this.validateInput(e));
          }),
        t
      );
    },
    validateInput(e) {
      let t = 0;
      return (
        "email" === e.dataset.required
          ? ((e.value = e.value.replace(" ", "")),
            this.emailTest(e) ? (this.addError(e), t++) : this.removeError(e))
          : ("checkbox" !== e.type || e.checked) && e.value
          ? this.removeError(e)
          : (this.addError(e), t++),
        t
      );
    },
    addError(e) {
      e.classList.add("_form-error"),
        e.parentElement.classList.add("_form-error");
      let t = e.parentElement.querySelector(".form__error");
      t && e.parentElement.removeChild(t),
        e.dataset.error &&
          e.parentElement.insertAdjacentHTML(
            "beforeend",
            `<div class="form__error">${e.dataset.error}</div>`
          );
    },
    removeError(e) {
      e.classList.remove("_form-error"),
        e.parentElement.classList.remove("_form-error"),
        e.parentElement.querySelector(".form__error") &&
          e.parentElement.removeChild(
            e.parentElement.querySelector(".form__error")
          );
    },
    formClean(t) {
      t.reset(),
        setTimeout(() => {
          let r = t.querySelectorAll("input,textarea");
          for (let e = 0; e < r.length; e++) {
            const t = r[e];
            t.parentElement.classList.remove("_form-focus"),
              t.classList.remove("_form-focus"),
              c.removeError(t);
          }
          let o = t.querySelectorAll(".checkbox__input");
          if (o.length > 0)
            for (let e = 0; e < o.length; e++) {
              o[e].checked = !1;
            }
          if (e.select) {
            let r = t.querySelectorAll(".select");
            if (r.length)
              for (let t = 0; t < r.length; t++) {
                const o = r[t].querySelector("select");
                e.select.selectBuild(o);
              }
          }
        }, 0);
    },
    emailTest: (e) =>
      !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(e.value),
  };
  e.watcher = new (class {
    constructor(e) {
      (this.config = Object.assign({ logging: !0 }, e)),
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
    scrollWatcherConstructor(e) {
      if (e.length) {
        this.scrollWatcherLogging(
          `Проснулся, слежу за объектами (${e.length})...`
        ),
          n(
            Array.from(e).map(function (e) {
              return `${
                e.dataset.watchRoot ? e.dataset.watchRoot : null
              }|${e.dataset.watchMargin ? e.dataset.watchMargin : "0px"}|${e.dataset.watchThreshold ? e.dataset.watchThreshold : 0}`;
            })
          ).forEach((t) => {
            let r = t.split("|"),
              o = { root: r[0], margin: r[1], threshold: r[2] },
              a = Array.from(e).filter(function (e) {
                let t = e.dataset.watchRoot ? e.dataset.watchRoot : null,
                  r = e.dataset.watchMargin ? e.dataset.watchMargin : "0px",
                  a = e.dataset.watchThreshold ? e.dataset.watchThreshold : 0;
                if (
                  String(t) === o.root &&
                  String(r) === o.margin &&
                  String(a) === o.threshold
                )
                  return e;
              }),
              n = this.getScrollWatcherConfig(o);
            this.scrollWatcherInit(a, n);
          });
      } else
        this.scrollWatcherLogging("Сплю, нет объектов для слежения. ZzzZZzz");
    }
    getScrollWatcherConfig(e) {
      let t = {};
      if (
        (document.querySelector(e.root)
          ? (t.root = document.querySelector(e.root))
          : "null" !== e.root &&
            this.scrollWatcherLogging(
              `Эмм... родительского объекта ${e.root} нет на странице`
            ),
        (t.rootMargin = e.margin),
        !(e.margin.indexOf("px") < 0 && e.margin.indexOf("%") < 0))
      ) {
        if ("prx" === e.threshold) {
          e.threshold = [];
          for (let t = 0; t <= 1; t += 0.005) e.threshold.push(t);
        } else e.threshold = e.threshold.split(",");
        return (t.threshold = e.threshold), t;
      }
      this.scrollWatcherLogging(
        "Ой ой, настройку data-watch-margin нужно задавать в PX или %"
      );
    }
    scrollWatcherCreate(e) {
      this.observer = new IntersectionObserver((e, t) => {
        e.forEach((e) => {
          this.scrollWatcherCallback(e, t);
        });
      }, e);
    }
    scrollWatcherInit(e, t) {
      this.scrollWatcherCreate(t), e.forEach((e) => this.observer.observe(e));
    }
    scrollWatcherIntersecting(e, t) {
      e.isIntersecting
        ? (!t.classList.contains("_watcher-view") &&
            t.classList.add("_watcher-view"),
          this.scrollWatcherLogging(
            `Я вижу ${t.classList}, добавил класс _watcher-view`
          ))
        : (t.classList.contains("_watcher-view") &&
            t.classList.remove("_watcher-view"),
          this.scrollWatcherLogging(
            `Я не вижу ${t.classList}, убрал класс _watcher-view`
          ));
    }
    scrollWatcherOff(e, t) {
      t.unobserve(e),
        this.scrollWatcherLogging(`Я перестал следить за ${e.classList}`);
    }
    scrollWatcherLogging(e) {
      this.config.logging && a(`[Наблюдатель]: ${e}`);
    }
    scrollWatcherCallback(e, t) {
      const r = e.target;
      this.scrollWatcherIntersecting(e, r),
        r.hasAttribute("data-watch-once") &&
          e.isIntersecting &&
          this.scrollWatcherOff(r, t),
        document.dispatchEvent(
          new CustomEvent("watcherCallback", { detail: { entry: e } })
        );
    }
  })({});
  let l = !1;
  setTimeout(() => {
    if (l) {
      let e = new Event("windowScroll");
      window.addEventListener("scroll", function (t) {
        document.dispatchEvent(e);
      });
    }
  }, 0);
  const i = document.querySelector(".about");
  i &&
    document.addEventListener("watcherCallback", function (e) {
      const t = e.detail.entry;
      "penguin" === t.target.dataset.watch &&
        (t.isIntersecting
          ? i.classList.add("_penguin-frame")
          : i.classList.remove("_penguin-frame"));
    });
  const d = document.querySelector(".advantages");
  d &&
    document.addEventListener("watcherCallback", function (e) {
      const t = e.detail.entry;
      "card-anim" === t.target.dataset.watch &&
        (t.isIntersecting
          ? d.classList.add("_cards-animation")
          : d.classList.remove("_cards-animation"));
    }),
    document.addEventListener("click", function (e) {
      const t = e.target;
      if (t.closest("[data-target]") && innerWidth < 991.98) {
        const r = t.dataset.target ? t.dataset.target : null,
          o = document.querySelector(`[data-card-content='${r}']`),
          a = document.querySelector(`[data-items='${r}']`);
        o
          ? (a.classList.toggle("_hide"), o.classList.toggle("_active"))
          : console.log("ouh, nothing there!"),
          e.preventDefault();
      }
    }),
    (window.FLS = !0),
    (function (e) {
      let t = new Image();
      (t.onload = t.onerror =
        function () {
          e(2 == t.height);
        }),
        (t.src =
          "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA");
    })(function (e) {
      let t = !0 === e ? "webp" : "no-webp";
      document.documentElement.classList.add(t);
    }),
    (function () {
      let e = document.querySelector(".icon-menu");
      e &&
        e.addEventListener("click", function (e) {
          t &&
            (((e = 500) => {
              document.documentElement.classList.contains("lock") ? r(e) : o(e);
            })(),
            document.documentElement.classList.toggle("menu-open"));
        });
    })(),
    (function () {
      const e = document.querySelectorAll(
        "input[placeholder],textarea[placeholder]"
      );
      e.length &&
        e.forEach((e) => {
          e.dataset.placeholder = e.placeholder;
        }),
        document.body.addEventListener("focusin", function (e) {
          const t = e.target;
          ("INPUT" !== t.tagName && "TEXTAREA" !== t.tagName) ||
            (t.dataset.placeholder && (t.placeholder = ""),
            t.classList.add("_form-focus"),
            t.parentElement.classList.add("_form-focus"),
            c.removeError(t));
        }),
        document.body.addEventListener("focusout", function (e) {
          const t = e.target;
          ("INPUT" !== t.tagName && "TEXTAREA" !== t.tagName) ||
            (t.dataset.placeholder && (t.placeholder = t.dataset.placeholder),
            t.classList.remove("_form-focus"),
            t.parentElement.classList.remove("_form-focus"),
            t.hasAttribute("data-validate") && c.validateInput(t));
        });
    })(),
    (function (t) {
      e.popup && e.popup.open("some");
      const r = document.forms;
      if (r.length)
        for (const e of r)
          e.addEventListener("submit", function (e) {
            o(e.target, e);
          }),
            e.addEventListener("reset", function (e) {
              const t = e.target;
              c.formClean(t);
            });
      async function o(e, r) {
        if (0 === (t ? c.getErrors(e) : 0)) {
          if (e.hasAttribute("data-ajax")) {
            r.preventDefault();
            const t = e.getAttribute("action")
                ? e.getAttribute("action").trim()
                : "#",
              o = e.getAttribute("method")
                ? e.getAttribute("method").trim()
                : "GET",
              a = new FormData(e);
            e.classList.add("_sending");
            const s = await fetch(t, { method: o, body: a });
            if (s.ok) {
              await s.json();
              e.classList.remove("_sending"), n(e);
            } else alert("Ошибка"), e.classList.remove("_sending");
          } else e.hasAttribute("data-dev") && (r.preventDefault(), n(e));
        } else {
          r.preventDefault();
          const t = e.querySelector("._form-error");
          t && e.hasAttribute("data-goto-error") && s(t, !0, 1e3);
        }
      }
      function n(t) {
        document.dispatchEvent(
          new CustomEvent("formSent", { detail: { form: t } })
        ),
          setTimeout(() => {
            if (e.popup) {
              const r = t.dataset.popupMessage;
              r && e.popup.open(r);
            }
          }, 0),
          c.formClean(t),
          a(`[Формы]: ${"Форма отправлена!"}`);
      }
    })(!0);
})();
