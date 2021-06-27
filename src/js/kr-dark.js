/*
 * 该部分代码采用 CC BY-NC-SA 4.0 许可协议，著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
 * 作者：Sukka
 * 来源：你好黑暗，我的老朋友 —— 为网站添加用户友好的深色模式支持 | Sukka's Blog
 * 链接：https://blog.skk.moe/post/hello-darkmode-my-old-friend/
 */

(() => {
	
	// <html></html>
    const rootElement = document.documentElement;
	// 作为 localStorage 的 key
    const darkModeStorageKey = 'user-color-scheme';
	// 深色模式属性名称
    const rootElementDarkModeAttributeName = 'data-user-color-scheme';
	// 深色模式切换按钮
    const darkModeTogglebuttonElement = document.getElementById('darkmode-switch');

	/**
	 * 设置 LocalStorage 的指定属性
	 */
    const setLS = (k, v) => {
		
        try {
            localStorage.setItem(k, v);
        } catch (e) {
			// (此处不进行处理)
		}
    };
	/**
	 * 移除 LocalStorage 的指定属性
	 */
    const removeLS = (k) => {
		
        try {
            localStorage.removeItem(k);
        } catch (e) {
			// (此处不进行处理)
		}
    };
	/**
	 * 获取 LocalStorage 的指定属性
	 */
    const getLS = (k) => {
		
        try {
            return localStorage.getItem(k);
        } catch (e) {
			// 与 localStorage 中没有找到对应 key 的行为一致
            return null;
        }
    };
	
	/**
	 * 获取当前生效的显示模式（深色/浅色）名称
	 */
    const getModeFromCSSMediaQuery = () => {
		
        return window.matchMedia('(prefers-color-scheme: dark)').matches 
				? 'dark' 
				: 'light'
    };
	
	/**
	 * 初始化 DOM根节点 以及 LocalStorage 的显示模式对应的属性
	 */
    const resetRootDarkModeAttributeAndLS = () => {
		
        rootElement.removeAttribute(rootElementDarkModeAttributeName);
		
        removeLS(darkModeStorageKey);
    };

	/**
	 * 校验key
	 */
    const validColorModeKeys = {
        'dark': true,
        'light': true
    };
    
	/**
	 * 提交指定的深色/浅色显示模式的设置
	 */
    const applyCustomDarkModeSettings = (mode) => {
		
        // 接受从「开关」处传来的模式，或者从 localStorage 读取
        const currentSetting = mode || getLS(darkModeStorageKey);
		
        if (currentSetting === getModeFromCSSMediaQuery()) {
            // 当用户自定义的显示模式和 prefers-color-scheme 相同时重置，恢复到自动模式
			
            resetRootDarkModeAttributeAndLS();
        } else if (validColorModeKeys[currentSetting]) {
			// (相比 <code>Array#indexOf</code>，这种写法 Uglify 后字节数更少)
			
            rootElement.setAttribute(rootElementDarkModeAttributeName, currentSetting);
        } else {
            // 首次访问或从未使用过开关、localStorage 中没有存储的值，currentSetting 是 <code>null</code>
            //⤷ 或者 localStorage 被篡改，currentSetting 不是合法值
			
            resetRootDarkModeAttributeAndLS();
        }
    };

    const invertDarkModeObj = {
        'dark': 'light',
        'light': 'dark'
    };
    
	/**
	 * 切换显示模式（深色/浅色）
	 */
    const toggleCustomDarkMode = () => {
		
        let currentSetting = getLS(darkModeStorageKey);
        
        if (validColorModeKeys[currentSetting]) {
			
            // 从 localStorage 中读取模式，并取相反的模式
            currentSetting = invertDarkModeObj[currentSetting];
        } else if (currentSetting === null) {
            // localStorage 中没有相关值，或者 localStorage 抛了 Error
            //⤷ 从 CSS 中读取当前 prefers-color-scheme 并取相反的模式
			
            currentSetting = invertDarkModeObj[getModeFromCSSMediaQuery()];
        } else {
            // localStorage 中的对应属性🡄非预期异常情况
			
			return;
        }
		
        // 将相反的模式写入 localStorage
        setLS(darkModeStorageKey, currentSetting);
		
		return currentSetting;
    };

    // 当页面加载时，将显示模式设置为 localStorage 中自定义的值（如果有的话）
    applyCustomDarkModeSettings();

	// 显示模式切换按钮🡄添加事件监听
    darkModeTogglebuttonElement.addEventListener('click', () => {
		// 当用户点击「开关」时，获得新的显示模式，写入 localStorage，并在页面上生效
		
		applyCustomDarkModeSettings(toggleCustomDarkMode());
    });
})();
