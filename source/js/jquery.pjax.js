(function($){

function fnPjax(selector, container, options) {
  options = optionsFor(container, options)
  return this.on('click.pjax', selector, function(event) {
    var opts = options
    if (!opts.container) {
      opts = $.extend({}, options)
      opts.container = $(this).attr('data-pjax')
    }
    handleClick(event, opts)
  })
}

function handleClick(event, container, options) {
  options = optionsFor(container, options)

  var link = event.currentTarget
  var $link = $(link)

  if (link.tagName.toUpperCase() !== 'A')
    throw "$.fn.pjax or $.pjax.click requires an anchor element"

      if ( event.which > 1 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey )
    return

    if ( location.protocol !== link.protocol || location.hostname !== link.hostname )
    return

    if ( link.href.indexOf('#') > -1 && stripHash(link) == stripHash(location) )
    return

    if (event.isDefaultPrevented())
    return

  var defaults = {
    url: link.href,
    container: $link.attr('data-pjax'),
    target: link
  }

  var opts = $.extend({}, defaults, options)
  var clickEvent = $.Event('pjax:click')
  $link.trigger(clickEvent, [opts])

  if (!clickEvent.isDefaultPrevented()) {
    pjax(opts)
    event.preventDefault()
    $link.trigger('pjax:clicked', [opts])
  }
}

function handleSubmit(event, container, options) {
  options = optionsFor(container, options)

  var form = event.currentTarget
  var $form = $(form)

  if (form.tagName.toUpperCase() !== 'FORM')
    throw "$.pjax.submit requires a form element"

  var defaults = {
    type: ($form.attr('method') || 'GET').toUpperCase(),
    url: $form.attr('action'),
    container: $form.attr('data-pjax'),
    target: form
  }

  if (defaults.type !== 'GET' && window.FormData !== undefined) {
    defaults.data = new FormData(form)
    defaults.processData = false
    defaults.contentType = false
  } else {
        if ($form.find(':file').length) {
      return
    }

        defaults.data = $form.serializeArray()
  }

  pjax($.extend({}, defaults, options))

  event.preventDefault()
}

function pjax(options) {
  options = $.extend(true, {}, $.ajaxSettings, pjax.defaults, options)

  if ($.isFunction(options.url)) {
    options.url = options.url()
  }

  var hash = parseURL(options.url).hash

  var containerType = $.type(options.container)
  if (containerType !== 'string') {
    throw "expected string value for 'container' option; got " + containerType
  }
  var context = options.context = $(options.container)
  if (!context.length) {
    throw "the container selector '" + options.container + "' did not match anything"
  }

          if (!options.data) options.data = {}
  if ($.isArray(options.data)) {
    options.data.push({name: '_pjax', value: options.container})
  } else {
    options.data._pjax = options.container
  }

  function fire(type, args, props) {
    if (!props) props = {}
    props.relatedTarget = options.target
    var event = $.Event(type, props)
    context.trigger(event, args)
    return !event.isDefaultPrevented()
  }

  var timeoutTimer

  options.beforeSend = function(xhr, settings) {
            if (settings.type !== 'GET') {
      settings.timeout = 0
    }

    xhr.setRequestHeader('X-PJAX', 'true')
    xhr.setRequestHeader('X-PJAX-Container', options.container)

    if (!fire('pjax:beforeSend', [xhr, settings]))
      return false

    if (settings.timeout > 0) {
      timeoutTimer = setTimeout(function() {
        if (fire('pjax:timeout', [xhr, options]))
          xhr.abort('timeout')
      }, settings.timeout)

            settings.timeout = 0
    }

    var url = parseURL(settings.url)
    if (hash) url.hash = hash
    options.requestUrl = stripInternalParams(url)
  }

  options.complete = function(xhr, textStatus) {
    if (timeoutTimer)
      clearTimeout(timeoutTimer)

    fire('pjax:complete', [xhr, textStatus, options])

    fire('pjax:end', [xhr, options])
  }

  options.error = function(xhr, textStatus, errorThrown) {
    var container = extractContainer("", xhr, options)

    var allowed = fire('pjax:error', [xhr, textStatus, errorThrown, options])
    if (options.type == 'GET' && textStatus !== 'abort' && allowed) {
      locationReplace(container.url)
    }
  }

  options.success = function(data, status, xhr) {
    var previousState = pjax.state

            var currentVersion = typeof $.pjax.defaults.version === 'function' ?
      $.pjax.defaults.version() :
      $.pjax.defaults.version

    var latestVersion = xhr.getResponseHeader('X-PJAX-Version')

    var container = extractContainer(data, xhr, options)

    var url = parseURL(container.url)
    if (hash) {
      url.hash = hash
      container.url = url.href
    }

        if (currentVersion && latestVersion && currentVersion !== latestVersion) {
      locationReplace(container.url)
      return
    }

        if (!container.contents) {
      locationReplace(container.url)
      return
    }

    pjax.state = {
      id: options.id || uniqueId(),
      url: container.url,
      title: container.title,
      container: options.container,
      fragment: options.fragment,
      timeout: options.timeout
    }

    if (options.push || options.replace) {
      window.history.replaceState(pjax.state, container.title, container.url)
    }

        var blurFocus = $.contains(context, document.activeElement)

        if (blurFocus) {
      try {
        document.activeElement.blur()
      } catch (e) { /* ignore */ }
    }

    if (container.title) document.title = container.title

    fire('pjax:beforeReplace', [container.contents, options], {
      state: pjax.state,
      previousState: previousState
    })
    context.html(container.contents)

                        var autofocusEl = context.find('input[autofocus], textarea[autofocus]').last()[0]
    if (autofocusEl && document.activeElement !== autofocusEl) {
      autofocusEl.focus()
    }

    executeScriptTags(container.scripts)

    var scrollTo = options.scrollTo

        if (hash) {
      var name = decodeURIComponent(hash.slice(1))
      var target = document.getElementById(name) || document.getElementsByName(name)[0]
      if (target) scrollTo = $(target).offset().top
    }

    if (typeof scrollTo == 'number') $(window).scrollTop(scrollTo)

    fire('pjax:success', [data, status, xhr, options])
  }


          if (!pjax.state) {
    pjax.state = {
      id: uniqueId(),
      url: window.location.href,
      title: document.title,
      container: options.container,
      fragment: options.fragment,
      timeout: options.timeout
    }
    window.history.replaceState(pjax.state, document.title)
  }

    abortXHR(pjax.xhr)

  pjax.options = options
  var xhr = pjax.xhr = $.ajax(options)

  if (xhr.readyState > 0) {
    if (options.push && !options.replace) {
            cachePush(pjax.state.id, [options.container, cloneContents(context)])

      window.history.pushState(null, "", options.requestUrl)
    }

    fire('pjax:start', [xhr, options])
    fire('pjax:send', [xhr, options])
  }

  return pjax.xhr
}

function pjaxReload(container, options) {
  var defaults = {
    url: window.location.href,
    push: false,
    replace: true,
    scrollTo: false
  }

  return pjax($.extend(defaults, optionsFor(container, options)))
}

function locationReplace(url) {
  window.history.replaceState(null, "", pjax.state.url)
  window.location.replace(url)
}


var initialPop = true
var initialURL = window.location.href
var initialState = window.history.state

if (initialState && initialState.container) {
  pjax.state = initialState
}

if ('state' in window.history) {
  initialPop = false
}

function onPjaxPopstate(event) {

    if (!initialPop) {
    abortXHR(pjax.xhr)
  }

  var previousState = pjax.state
  var state = event.state
  var direction

  if (state && state.container) {
                if (initialPop && initialURL == state.url) return

    if (previousState) {
                  if (previousState.id === state.id) return

            direction = previousState.id < state.id ? 'forward' : 'back'
    }

    var cache = cacheMapping[state.id] || []
    var containerSelector = cache[0] || state.container
    var container = $(containerSelector), contents = cache[1]

    if (container.length) {
      if (previousState) {
                        cachePop(direction, previousState.id, [containerSelector, cloneContents(container)])
      }

      var popstateEvent = $.Event('pjax:popstate', {
        state: state,
        direction: direction
      })
      container.trigger(popstateEvent)

      var options = {
        id: state.id,
        url: state.url,
        container: containerSelector,
        push: false,
        fragment: state.fragment,
        timeout: state.timeout,
        scrollTo: false
      }

      if (contents) {
        container.trigger('pjax:start', [null, options])

        pjax.state = state
        if (state.title) document.title = state.title
        var beforeReplaceEvent = $.Event('pjax:beforeReplace', {
          state: state,
          previousState: previousState
        })
        container.trigger(beforeReplaceEvent, [contents, options])
        container.html(contents)

        container.trigger('pjax:end', [null, options])
      } else {
        pjax(options)
      }

                  container[0].offsetHeight     } else {
      locationReplace(location.href)
    }
  }
  initialPop = false
}

function fallbackPjax(options) {
  var url = $.isFunction(options.url) ? options.url() : options.url,
      method = options.type ? options.type.toUpperCase() : 'GET'

  var form = $('<form>', {
    method: method === 'GET' ? 'GET' : 'POST',
    action: url,
    style: 'display:none'
  })

  if (method !== 'GET' && method !== 'POST') {
    form.append($('<input>', {
      type: 'hidden',
      name: '_method',
      value: method.toLowerCase()
    }))
  }

  var data = options.data
  if (typeof data === 'string') {
    $.each(data.split('&'), function(index, value) {
      var pair = value.split('=')
      form.append($('<input>', {type: 'hidden', name: pair[0], value: pair[1]}))
    })
  } else if ($.isArray(data)) {
    $.each(data, function(index, value) {
      form.append($('<input>', {type: 'hidden', name: value.name, value: value.value}))
    })
  } else if (typeof data === 'object') {
    var key
    for (key in data)
      form.append($('<input>', {type: 'hidden', name: key, value: data[key]}))
  }

  $(document.body).append(form)
  form.submit()
}

function abortXHR(xhr) {
  if ( xhr && xhr.readyState < 4) {
    xhr.onreadystatechange = $.noop
    xhr.abort()
  }
}

function uniqueId() {
  return (new Date).getTime()
}

function cloneContents(container) {
  var cloned = container.clone()
      cloned.find('script').each(function(){
    if (!this.src) $._data(this, 'globalEval', false)
  })
  return cloned.contents()
}

function stripInternalParams(url) {
  url.search = url.search.replace(/([?&])(_pjax|_)=[^&]*/g, '').replace(/^&/, '')
  return url.href.replace(/\?($|#)/, '$1')
}

function parseURL(url) {
  var a = document.createElement('a')
  a.href = url
  return a
}

function stripHash(location) {
  return location.href.replace(/#.*/, '')
}

function optionsFor(container, options) {
  if (container && options) {
    options = $.extend({}, options)
    options.container = container
    return options
  } else if ($.isPlainObject(container)) {
    return container
  } else {
    return {container: container}
  }
}

function findAll(elems, selector) {
  return elems.filter(selector).add(elems.find(selector))
}

function parseHTML(html) {
  return $.parseHTML(html, document, true)
}

function extractContainer(data, xhr, options) {
  var obj = {}, fullDocument = /<html/i.test(data)

      var serverUrl = xhr.getResponseHeader('X-PJAX-URL')
  obj.url = serverUrl ? stripInternalParams(parseURL(serverUrl)) : options.requestUrl

  var $head, $body
    if (fullDocument) {
    $body = $(parseHTML(data.match(/<body[^>]*>([\s\S.]*)<\/body>/i)[0]))
    var head = data.match(/<head[^>]*>([\s\S.]*)<\/head>/i)
    $head = head != null ? $(parseHTML(head[0])) : $body
  } else {
    $head = $body = $(parseHTML(data))
  }

    if ($body.length === 0)
    return obj

      obj.title = findAll($head, 'title').last().text()

  if (options.fragment) {
    var $fragment = $body
            if (options.fragment !== 'body') {
      $fragment = findAll($fragment, options.fragment).first()
    }

    if ($fragment.length) {
      obj.contents = options.fragment === 'body' ? $fragment : $fragment.contents()

                  if (!obj.title)
        obj.title = $fragment.attr('title') || $fragment.data('title')
    }

  } else if (!fullDocument) {
    obj.contents = $body
  }

    if (obj.contents) {
        obj.contents = obj.contents.not(function() { return $(this).is('title') })

        obj.contents.find('title').remove()

        obj.scripts = findAll(obj.contents, 'script[src]').remove()
    obj.contents = obj.contents.not(obj.scripts)
  }

    if (obj.title) obj.title = $.trim(obj.title)

  return obj
}

function executeScriptTags(scripts) {
  if (!scripts) return

  var existingScripts = $('script[src]')

  scripts.each(function() {
    var src = this.src
    var matchedScripts = existingScripts.filter(function() {
      return this.src === src
    })
    if (matchedScripts.length) return

    var script = document.createElement('script')
    var type = $(this).attr('type')
    if (type) script.type = type
    script.src = $(this).attr('src')
    document.head.appendChild(script)
  })
}

var cacheMapping      = {}
var cacheForwardStack = []
var cacheBackStack    = []

function cachePush(id, value) {
  cacheMapping[id] = value
  cacheBackStack.push(id)

    trimCacheStack(cacheForwardStack, 0)

    trimCacheStack(cacheBackStack, pjax.defaults.maxCacheLength)
}

function cachePop(direction, id, value) {
  var pushStack, popStack
  cacheMapping[id] = value

  if (direction === 'forward') {
    pushStack = cacheBackStack
    popStack  = cacheForwardStack
  } else {
    pushStack = cacheForwardStack
    popStack  = cacheBackStack
  }

  pushStack.push(id)
  id = popStack.pop()
  if (id) delete cacheMapping[id]

    trimCacheStack(pushStack, pjax.defaults.maxCacheLength)
}

function trimCacheStack(stack, length) {
  while (stack.length > length)
    delete cacheMapping[stack.shift()]
}

function findVersion() {
  return $('meta').filter(function() {
    var name = $(this).attr('http-equiv')
    return name && name.toUpperCase() === 'X-PJAX-VERSION'
  }).attr('content')
}

function enable() {
  $.fn.pjax = fnPjax
  $.pjax = pjax
  $.pjax.enable = $.noop
  $.pjax.disable = disable
  $.pjax.click = handleClick
  $.pjax.submit = handleSubmit
  $.pjax.reload = pjaxReload
  $.pjax.defaults = {
    timeout: 650,
    push: true,
    replace: false,
    type: 'GET',
    dataType: 'html',
    scrollTo: 0,
    maxCacheLength: 20,
    version: findVersion
  }
  $(window).on('popstate.pjax', onPjaxPopstate)
}

function disable() {
  $.fn.pjax = function() { return this }
  $.pjax = fallbackPjax
  $.pjax.enable = enable
  $.pjax.disable = $.noop
  $.pjax.click = $.noop
  $.pjax.submit = $.noop
  $.pjax.reload = function() { window.location.reload() }

  $(window).off('popstate.pjax', onPjaxPopstate)
}


if ($.event.props && $.inArray('state', $.event.props) < 0) {
  $.event.props.push('state')
} else if (!('state' in $.Event.prototype)) {
  $.event.addProp('state')
}

$.support.pjax =
  window.history && window.history.pushState && window.history.replaceState &&
    !navigator.userAgent.match(/((iPod|iPhone|iPad).+\bOS\s+[1-4]\D|WebApps\/.+CFNetwork)/)

if ($.support.pjax) {
  enable()
} else {
  disable()
}

})(jQuery)

$(function() {
  $(document).pjax('a[target!=_blank]', '#main', {fragment:'#main', timeout:6000});    
       $(document).on('pjax:send', function() {
        $('html, body').animate({
          scrollTop:$('#kratos-blog-post').offset().top
        },500);
        //$("#main").fadeToggle("slow");
       });
      //  $(document).on('pjax:complete', function() {
      //   //$("#main").fadeToggle("slow");
      //  });
  });