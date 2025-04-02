const mbtiData = {
    I: {
        title: "內向 (Introversion)",
        description: "喜歡獨處，從內在世界獲取能量，思考深度較高。"
    },
    E: {
        title: "外向 (Extraversion)",
        description: "喜歡社交，從外在世界獲取能量，較擅長與人互動。"
    },
    S: {
        title: "實感型 (Sensing)",
        description: "重視現實和具體細節，依賴經驗和事實做決策。"
    },
    N: {
        title: "直覺型 (Intuition)",
        description: "關注未來可能性，偏好抽象概念與模式辨識。"
    },
    T: {
        title: "思考型 (Thinking)",
        description: "以邏輯和客觀分析為主，注重公平和原則。"
    },
    F: {
        title: "情感型 (Feeling)",
        description: "以情感和價值觀為主，重視人際關係與和諧。"
    },
    J: {
        title: "判斷型 (Judging)",
        description: "喜歡計劃和有結構的生活，做事有條理且注重控制。"
    },
    P: {
        title: "知覺型 (Perceiving)",
        description: "偏好彈性與適應性，較隨興且喜歡探索不同可能性。"
    }
};

// 所有有效的 MBTI 類型
const allMBTITypes = [
    "ISTJ", "ISFJ", "INFJ", "INTJ", 
    "ISTP", "ISFP", "INFP", "INTP", 
    "ESTP", "ESFP", "ENFP", "ENTP", 
    "ESTJ", "ESFJ", "ENFJ", "ENTJ"
];

document.addEventListener('DOMContentLoaded', () => {
    const mbtiInput = document.getElementById('mbtiInput');
    const searchBtn = document.getElementById('searchBtn');
    const resultSection = document.getElementById('resultSection');
    const typeTitle = document.getElementById('typeTitle');
    
    // 創建自動完成容器
    const autocompleteContainer = document.createElement('div');
    autocompleteContainer.className = 'autocomplete-container';
    mbtiInput.parentNode.insertBefore(autocompleteContainer, mbtiInput.nextSibling);
    
    // 創建自動完成列表
    const autocompleteList = document.createElement('ul');
    autocompleteList.className = 'autocomplete-list';
    autocompleteContainer.appendChild(autocompleteList);

    // 鍵盤導航相關變量
    let selectedIndex = -1;
    let currentMatches = [];

    function validateMBTI(input) {
        return allMBTITypes.includes(input.toUpperCase());
    }

    function updateExplanation(mbtiType) {
        const dimensions = document.querySelectorAll('.dimension');
        const letters = mbtiType.toUpperCase().split('');
        
        typeTitle.textContent = letters.join(' · ');
        
        letters.forEach((letter, index) => {
            const data = mbtiData[letter];
            const heading = dimensions[index].querySelector('h3');
            const description = dimensions[index].querySelector('p');
            
            // Extract the English word from the title (it's in parentheses)
            const englishWord = data.title.match(/\((.*?)\)/)[1];
            const titleWithoutWord = data.title.replace(/\((.*?)\)/, '');
            heading.innerHTML = `${titleWithoutWord} (<span class="highlight-letter">${englishWord.charAt(0)}</span>${englishWord.slice(1)})`;
            description.textContent = data.description;
        });

        resultSection.classList.add('active');
    }

    function handleSearch() {
        const input = mbtiInput.value.trim();
        
        if (!validateMBTI(input)) {
            alert('請輸入有效的 MBTI 類型（例如：INTJ）');
            return;
        }

        updateExplanation(input);
        hideAutocomplete();
    }
    
    // 顯示自動完成選項
    function showAutocomplete(input) {
        const value = input.toUpperCase();
        autocompleteList.innerHTML = '';
        selectedIndex = -1;
        
        if (value.length === 0) {
            hideAutocomplete();
            return;
        }
        
        currentMatches = allMBTITypes.filter(type => 
            type.startsWith(value)
        );
        
        if (currentMatches.length > 0) {
            currentMatches.forEach((type, index) => {
                const li = document.createElement('li');
                li.textContent = type;
                li.addEventListener('click', () => {
                    mbtiInput.value = type;
                    hideAutocomplete();
                    updateExplanation(type);
                    updateButtonState();
                });
                autocompleteList.appendChild(li);
            });
            autocompleteContainer.style.display = 'block';
        } else {
            hideAutocomplete();
        }
    }
    
    // 更新選中項目的樣式
    function updateSelectedItem() {
        const items = autocompleteList.querySelectorAll('li');
        items.forEach((item, index) => {
            if (index === selectedIndex) {
                item.style.backgroundColor = '#f0f7ff';
            } else {
                item.style.backgroundColor = '';
            }
        });
    }

    // 處理鍵盤導航
    function handleKeyNavigation(e) {
        if (autocompleteContainer.style.display === 'none') return;

        const items = autocompleteList.querySelectorAll('li');
        if (items.length === 0) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                selectedIndex = (selectedIndex + 1) % items.length;
                updateSelectedItem();
                break;
            case 'ArrowUp':
                e.preventDefault();
                selectedIndex = (selectedIndex - 1 + items.length) % items.length;
                updateSelectedItem();
                break;
            case 'Enter':
                e.preventDefault();
                if (selectedIndex >= 0 && selectedIndex < currentMatches.length) {
                    const selectedType = currentMatches[selectedIndex];
                    mbtiInput.value = selectedType;
                    hideAutocomplete();
                    updateExplanation(selectedType);
                    updateButtonState();
                }
                break;
            case 'Escape':
                hideAutocomplete();
                break;
        }
    }

    // 隱藏自動完成選項
    function hideAutocomplete() {
        autocompleteContainer.style.display = 'none';
    }
    
    // 更新按鈕狀態
    function updateButtonState() {
        const input = mbtiInput.value.trim();
        const isValid = validateMBTI(input);
        
        if (isValid) {
            searchBtn.disabled = false;
            searchBtn.classList.remove('disabled');
        } else {
            searchBtn.disabled = true;
            searchBtn.classList.add('disabled');
        }
    }

    searchBtn.addEventListener('click', handleSearch);

    mbtiInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !searchBtn.disabled) {
            handleSearch();
        }
    });
    
    mbtiInput.addEventListener('keydown', handleKeyNavigation);
    
    // 輸入時顯示自動完成選項並更新按鈕狀態
    mbtiInput.addEventListener('input', () => {
        showAutocomplete(mbtiInput.value);
        updateButtonState();
    });
    
    // 點擊其他地方時隱藏自動完成選項
    document.addEventListener('click', (e) => {
        if (!autocompleteContainer.contains(e.target) && e.target !== mbtiInput) {
            hideAutocomplete();
        }
    });
    
    // 初始化按鈕狀態
    updateButtonState();
}); 