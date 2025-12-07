//ローディングから画面遷移
const loadingAreaGrey = document.querySelector('#loading');
const loadingAreaGreen = document.querySelector('#loading-screen');

window.addEventListener('load', () =>{
    //ローディング中(グレースクリーン)
    loadingAreaGrey.animate(
        {
            opacity: [1,0],
            visibility: 'hidden',
        },
        {
            duration: 1500,
            delay: 1200,
            easing: 'ease',
            fill: 'forwards'
        }
    );

    //ローディング中(紺色スクリーン)
    loadingAreaGreen.animate(
        {
            translate: ['0 100vh', '0 0', '0 -100vh'] 
        },
        {
            duration: 5000,
            delay: 900,
            easing: 'ease',
            fill: 'forwards'
        }
    );
});

//スライドメニュー
const menuOpen = document.querySelector('#menu-open');
const menuClose = document.querySelector('#menu-close');
const menuPanel = document.querySelector('#menu-panel');
const menuItems = document.querySelectorAll('#menu-panel li');
const menuOptions = {
    duration: 1400,
    easing: 'ease',
    fill: 'forwards',
};

//メニューを開く
menuOpen.addEventListener('click', () => {
    //console.log('メニューを開く');
    menuPanel.animate({translate: ['100vw', 0]}, menuOptions);

    //リンクをひとつずつ順に表示
    menuItems.forEach((menuItem, index) =>{
        //console.log(`$[index]番目のリスト`);
        menuItem.animate(
            {
                opacity: [0, 1],
                translate: ['2rem', 0],
            },
            {
                duration: 2400,
                delay: 300 * index,
                easing: 'ease',
                fill: 'forwards',
            }
        );
    });
});

//メニューを閉じる
menuClose.addEventListener('click', () => {
    menuPanel.animate({translate: [0, '100vw']}, menuOptions);
    menuItems.forEach((menuItem) =>{
        menuItem.animate({opacity: [1, 0]}, menuOptions);
    });
});

//監視対象が範囲内に現れたら実行する動作
const animateFade = (entries, obs) => {
    entries.forEach((entry) => {
    if (entry.isIntersecting) {
        entry.target.animate(
        {
            opacity: [0, 1],
            filter: ['blur(.4rem)', 'blur(0)'], 
            translate: ['0 4rem', 0],
        },
        {
            duration: 2000,
            easing: 'ease',
            fill: 'forwards',
        }
        );
      // 一度表示されたら監視をやめる
        obs.unobserve(entry.target);
    }
    });
};
//監視範囲を狭く
const options = {
    rootMargin: "-20% 0px",
    threshold: 0.1
};
// 監視設定
const fadeObserver = new IntersectionObserver(animateFade,options);
// .fadeinを監視するよう指示
const fadeElements = document.querySelectorAll('.fadein');
fadeElements.forEach((fadeElement) => {
    fadeObserver.observe(fadeElement);
});

// スマホ用横スクロールボタンの動作（Activityページ用）
const scrollNextBtn = document.querySelector('#scroll-next');
const scrollWrapper = document.querySelector('.activity-scroll-wrapper');

if(scrollNextBtn && scrollWrapper) {
    scrollNextBtn.addEventListener('click', () => {
        // カード要素をすべて取得
        const cards = scrollWrapper.querySelectorAll('.activity-main');
        if (cards.length === 0) return;

        // カード1枚分の幅 + ギャップ(20px)を計算
        const cardWidth = cards[0].offsetWidth;
        const gap = 20; 
        const itemStride = cardWidth + gap;
        
        // 現在のスクロール位置から、何枚目（インデックス）にいるか計算
        const currentScroll = scrollWrapper.scrollLeft;
        const currentIndex = Math.round(currentScroll / itemStride);

        // 次のインデックスを決定 (最後の次は0に戻る)
        let nextIndex = currentIndex + 1;
        if (nextIndex >= cards.length) {
            nextIndex = 0;
        }

        // 計算した位置へスクロール
        scrollWrapper.scrollTo({
            left: nextIndex * itemStride,
            behavior: 'smooth'
        });
    });
}

// スマホ用横スクロールボタンの動作（Taskページ用）
const taskScrollNextBtn = document.querySelector('#task-scroll-next');
const taskScrollWrapper = document.querySelector('.task-scroll-wrapper');

if(taskScrollNextBtn && taskScrollWrapper) {
    taskScrollNextBtn.addEventListener('click', () => {
        // カード要素をすべて取得
        const cards = taskScrollWrapper.querySelectorAll('.work-card');
        if (cards.length === 0) return;

        // カード1枚分の幅 + ギャップ(20px)を計算
        // cssで width: 85vw, gap: 20px となっている前提
        const cardWidth = cards[0].offsetWidth;
        const gap = 20; 
        const itemStride = cardWidth + gap;
        
        // 現在のスクロール位置から、何枚目（インデックス）にいるか計算
        const currentScroll = taskScrollWrapper.scrollLeft;
        const currentIndex = Math.round(currentScroll / itemStride);

        // 次のインデックスを決定 (最後の次は0に戻る)
        let nextIndex = currentIndex + 1;
        if (nextIndex >= cards.length) {
            nextIndex = 0;
        }

        // 計算した位置へスクロール
        taskScrollWrapper.scrollTo({
            left: nextIndex * itemStride,
            behavior: 'smooth'
        });
    });
}