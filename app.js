(function() {
    const { geographyData, biologyData, practiceQuestions } = window.APP_DATA;

    let state = {
        activeSubject: 'welcome', // 'geo', 'bio', 'practice', 'welcome'
        activeVolumeId: '',
        userAnswers: {},
        showExplanations: {},
        searchQuery: '',
        selectedPracticeSubject: 'all',
        selectedPracticeDifficulty: 'all'
    };

    // --- DOM Elements ---
    const sidebarNav = document.getElementById('sidebar-nav');
    const mainContent = document.getElementById('main-content');
    const searchOverlay = document.getElementById('search-overlay');
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    const searchClose = document.getElementById('search-close');
    const searchTrigger = document.getElementById('search-trigger');
    const searchBackdrop = document.getElementById('search-backdrop');
    const fabSearch = document.getElementById('fab-search');

    // --- Initialization ---
    function init() {
        renderSidebar();
        renderMainContent();
        setupEventListeners();
        lucide.createIcons();
    }

    // --- Event Listeners ---
    function setupEventListeners() {
        searchTrigger.addEventListener('click', openSearch);
        fabSearch.addEventListener('click', openSearch);
        searchClose.addEventListener('click', closeSearch);
        searchBackdrop.addEventListener('click', closeSearch);
        searchInput.addEventListener('input', handleSearchInput);
        
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeSearch();
        });
    }

    // --- State Management ---
    function setState(newState) {
        state = { ...state, ...newState };
        renderSidebar();
        renderMainContent();
        lucide.createIcons();
    }

    // --- Rendering Functions ---

    function renderSidebar() {
        let html = `
            <!-- Practice Section -->
            <div>
                <button onclick="navigateTo('practice', 'practice')" class="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm transition-all font-bold ${state.activeSubject === 'practice' ? 'bg-slate-900 text-white shadow-lg shadow-slate-200' : 'text-slate-600 hover:bg-slate-50'}">
                    <i data-lucide="clipboard-list" class="w-4.5 h-4.5"></i>
                    <span>模拟练习题库</span>
                </button>
            </div>

            <!-- Geography Section -->
            <div>
                <div class="flex items-center gap-2 px-2 mb-3 text-slate-400 font-semibold text-xs uppercase tracking-wider">
                    <i data-lucide="map" class="w-3.5 h-3.5"></i>
                    <span>地理 (湘教版)</span>
                </div>
                <div class="space-y-1">
                    ${geographyData.map(vol => `
                        <button onclick="navigateTo('geo', '${vol.id}')" class="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all group ${state.activeSubject === 'geo' && state.activeVolumeId === vol.id ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-slate-600 hover:bg-slate-50'}">
                            <span>${vol.name}</span>
                            <i data-lucide="chevron-right" class="w-3.5 h-3.5 transition-transform ${state.activeSubject === 'geo' && state.activeVolumeId === vol.id ? 'rotate-90' : 'opacity-0 group-hover:opacity-100'}"></i>
                        </button>
                    `).join('')}
                </div>
            </div>

            <!-- Biology Section -->
            <div>
                <div class="flex items-center gap-2 px-2 mb-3 text-slate-400 font-semibold text-xs uppercase tracking-wider">
                    <i data-lucide="microscope" class="w-3.5 h-3.5"></i>
                    <span>生物 (人教版)</span>
                </div>
                <div class="space-y-1">
                    ${biologyData.map(vol => `
                        <button onclick="navigateTo('bio', '${vol.id}')" class="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all group ${state.activeSubject === 'bio' && state.activeVolumeId === vol.id ? 'bg-emerald-50 text-emerald-700 font-medium' : 'text-slate-600 hover:bg-slate-50'}">
                            <span>${vol.name}</span>
                            <i data-lucide="chevron-right" class="w-3.5 h-3.5 transition-transform ${state.activeSubject === 'bio' && state.activeVolumeId === vol.id ? 'rotate-90' : 'opacity-0 group-hover:opacity-100'}"></i>
                        </button>
                    `).join('')}
                </div>
            </div>
        `;
        sidebarNav.innerHTML = html;
        lucide.createIcons();
    }

    function renderMainContent() {
        if (state.activeSubject === 'welcome') {
            renderWelcome();
        } else if (state.activeSubject === 'practice') {
            renderPractice();
        } else {
            renderContentArea();
        }
    }

    function renderWelcome() {
        mainContent.innerHTML = `
            <div class="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <div class="w-24 h-24 bg-indigo-600 rounded-3xl flex items-center justify-center text-white mb-8 shadow-2xl shadow-indigo-200">
                    <i data-lucide="graduation-cap" class="w-12 h-12"></i>
                </div>
                <h1 class="text-5xl font-black text-slate-900 tracking-tight mb-4">生地会考全能复习助手</h1>
                <p class="text-xl text-slate-500 max-w-xl leading-relaxed mb-12">整合湘教版地理与人教版生物核心知识点，<br />为你提供结构化、沉浸式的复习体验。</p>
                
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
                    <button onclick="navigateTo('geo', 'geo-7-1')" class="group p-8 bg-white border border-slate-200 rounded-3xl hover:border-indigo-500 hover:shadow-xl hover:shadow-indigo-50 transition-all text-left">
                        <div class="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                            <i data-lucide="sparkles" class="w-6 h-6"></i>
                        </div>
                        <h3 class="text-xl font-bold text-slate-900 mb-2">地理复习</h3>
                        <p class="text-slate-500 text-sm">湘教版七上至八下全覆盖，包含经纬网、气候、区域地理等核心考点。</p>
                    </button>

                    <button onclick="navigateTo('bio', 'bio-7-1')" class="group p-8 bg-white border border-slate-200 rounded-3xl hover:border-emerald-500 hover:shadow-xl hover:shadow-emerald-50 transition-all text-left">
                        <div class="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                            <i data-lucide="sparkles" class="w-6 h-6"></i>
                        </div>
                        <h3 class="text-xl font-bold text-slate-900 mb-2">生物复习</h3>
                        <p class="text-slate-500 text-sm">人教版七上至八下全覆盖，包含细胞、人体系统、遗传进化等核心考点。</p>
                    </button>

                    <button onclick="navigateTo('practice', 'practice')" class="group p-8 bg-slate-900 border border-slate-800 rounded-3xl hover:shadow-xl hover:shadow-slate-200 transition-all text-left">
                        <div class="w-12 h-12 bg-white/10 text-white rounded-2xl flex items-center justify-center mb-6 group-hover:bg-white group-hover:text-slate-900 transition-colors">
                            <i data-lucide="clipboard-list" class="w-6 h-6"></i>
                        </div>
                        <h3 class="text-xl font-bold text-white mb-2">模拟练习</h3>
                        <p class="text-slate-400 text-sm">精选模拟题库，支持按科目和难度筛选，实时解析助你攻克重难点。</p>
                    </button>
                </div>
            </div>
        `;
    }

    function renderContentArea() {
        const data = state.activeSubject === 'geo' ? geographyData : biologyData;
        const volume = data.find(v => v.id === state.activeVolumeId) || data[0];
        
        mainContent.innerHTML = `
            <div class="flex-1 max-w-4xl mx-auto px-8 py-12">
                <header class="border-b border-slate-200 pb-8">
                    <div class="flex items-center gap-2 text-indigo-600 font-semibold text-sm mb-2">
                        <i data-lucide="hash" class="w-4 h-4"></i>
                        <span>${state.activeSubject === 'geo' ? '地理' : '生物'}</span>
                    </div>
                    <h2 class="text-4xl font-bold text-slate-900 tracking-tight">${volume.name}</h2>
                    <p class="text-slate-500 mt-2">点击下方章节查看详细知识点</p>
                </header>

                <div class="space-y-16 mt-12">
                    ${volume.sections.map((section, idx) => `
                        <section id="${section.id}" class="scroll-mt-24">
                            <div class="flex items-center justify-between mb-6">
                                <h3 class="text-2xl font-bold text-slate-800 flex items-center gap-3">
                                    <span class="w-8 h-8 rounded-full bg-slate-100 text-slate-500 text-sm flex items-center justify-center font-mono">${idx + 1}</span>
                                    ${section.title}
                                </h3>
                                <div class="flex gap-2">
                                    ${section.tags.map(tag => `
                                        <span class="flex items-center gap-1 px-2 py-1 bg-slate-100 text-slate-600 text-[10px] font-semibold uppercase tracking-wider rounded-md">
                                            <i data-lucide="tag" class="w-2.5 h-2.5"></i>
                                            ${tag}
                                        </span>
                                    `).join('')}
                                </div>
                            </div>
                            <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 markdown-body">
                                ${marked.parse(section.content)}
                            </div>
                        </section>
                    `).join('')}
                </div>
            </div>
        `;
    }

    function renderPractice() {
        const difficultyLabels = {
            easy: { label: '简单', color: 'bg-emerald-100 text-emerald-700' },
            medium: { label: '中等', color: 'bg-amber-100 text-amber-700' },
            hard: { label: '困难', color: 'bg-rose-100 text-rose-700' }
        };

        const filteredQuestions = practiceQuestions.filter(q => {
            const subjectMatch = state.selectedPracticeSubject === 'all' || q.subject === state.selectedPracticeSubject;
            const difficultyMatch = state.selectedPracticeDifficulty === 'all' || q.difficulty === state.selectedPracticeDifficulty;
            return subjectMatch && difficultyMatch;
        });

        mainContent.innerHTML = `
            <div class="flex-1 max-w-4xl mx-auto px-8 py-12">
                <header class="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-8">
                    <div>
                        <h2 class="text-4xl font-bold text-slate-900 tracking-tight">模拟练习</h2>
                        <p class="text-slate-500 mt-2 text-lg">通过精选题目巩固所学知识，查漏补缺。</p>
                    </div>
                    <button onclick="resetPractice()" class="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-colors text-sm font-medium">
                        <i data-lucide="refresh-ccw" class="w-4 h-4"></i>
                        重置练习
                    </button>
                </header>

                <!-- Filters -->
                <div class="flex flex-wrap gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mt-8">
                    <div class="flex items-center gap-2 text-slate-400 mr-2">
                        <i data-lucide="filter" class="w-4.5 h-4.5"></i>
                        <span class="text-sm font-medium">筛选:</span>
                    </div>
                    
                    <select onchange="updatePracticeFilter('subject', this.value)" class="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all">
                        <option value="all" ${state.selectedPracticeSubject === 'all' ? 'selected' : ''}>全部科目</option>
                        <option value="geo" ${state.selectedPracticeSubject === 'geo' ? 'selected' : ''}>地理</option>
                        <option value="bio" ${state.selectedPracticeSubject === 'bio' ? 'selected' : ''}>生物</option>
                    </select>

                    <select onchange="updatePracticeFilter('difficulty', this.value)" class="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all">
                        <option value="all" ${state.selectedPracticeDifficulty === 'all' ? 'selected' : ''}>全部难度</option>
                        <option value="easy" ${state.selectedPracticeDifficulty === 'easy' ? 'selected' : ''}>简单</option>
                        <option value="medium" ${state.selectedPracticeDifficulty === 'medium' ? 'selected' : ''}>中等</option>
                        <option value="hard" ${state.selectedPracticeDifficulty === 'hard' ? 'selected' : ''}>困难</option>
                    </select>
                </div>

                <!-- Questions List -->
                <div class="space-y-6 mt-8">
                    ${filteredQuestions.length > 0 ? filteredQuestions.map((q, idx) => {
                        const hasAnswered = state.userAnswers[q.id] !== undefined;
                        const selectedOption = state.userAnswers[q.id];

                        return `
                            <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                                <div class="p-6">
                                    <div class="flex items-center justify-between mb-4">
                                        <div class="flex items-center gap-3">
                                            <span class="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded uppercase tracking-wider">${q.subject === 'geo' ? '地理' : '生物'}</span>
                                            <span class="text-xs text-slate-400 font-medium">${q.topic}</span>
                                        </div>
                                        <span class="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${difficultyLabels[q.difficulty].color}">${difficultyLabels[q.difficulty].label}</span>
                                    </div>

                                    <h3 class="text-lg font-bold text-slate-800 mb-6 leading-relaxed">
                                        <span class="text-slate-300 mr-2 font-mono">${idx + 1}.</span>
                                        ${q.question}
                                    </h3>

                                    <div class="grid grid-cols-1 gap-3">
                                        ${q.options.map((option, oIdx) => {
                                            const isSelected = selectedOption === oIdx;
                                            const isCorrect = q.answer === oIdx;
                                            
                                            let btnClass = "flex items-center justify-between p-4 rounded-xl border text-left transition-all group";
                                            let iconHtml = "";

                                            if (!hasAnswered) {
                                                btnClass += " border-slate-100 bg-slate-50 hover:border-indigo-200 hover:bg-indigo-50/30 text-slate-600";
                                            } else if (isCorrect) {
                                                btnClass += " border-emerald-200 bg-emerald-50 text-emerald-700 font-medium";
                                                iconHtml = '<i data-lucide="check-circle-2" class="text-emerald-500 w-4.5 h-4.5"></i>';
                                            } else if (isSelected && !isCorrect) {
                                                btnClass += " border-rose-200 bg-rose-50 text-rose-700 font-medium";
                                                iconHtml = '<i data-lucide="x-circle" class="text-rose-500 w-4.5 h-4.5"></i>';
                                            } else {
                                                btnClass += " border-slate-100 bg-slate-50 text-slate-400 opacity-60";
                                            }

                                            const circleClass = !hasAnswered ? "bg-white border-slate-200 text-slate-400 group-hover:border-indigo-300 group-hover:text-indigo-500" :
                                                              isCorrect ? "bg-emerald-500 border-emerald-500 text-white" :
                                                              isSelected ? "bg-rose-500 border-rose-500 text-white" : "bg-slate-100 border-slate-200 text-slate-300";

                                            return `
                                                <button onclick="handlePracticeAnswer('${q.id}', ${oIdx})" ${hasAnswered ? 'disabled' : ''} class="${btnClass}">
                                                    <div class="flex items-center gap-3">
                                                        <span class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border ${circleClass}">
                                                            ${String.fromCharCode(65 + oIdx)}
                                                        </span>
                                                        ${option}
                                                    </div>
                                                    ${iconHtml}
                                                </button>
                                            `;
                                        }).join('')}
                                    </div>

                                    ${state.showExplanations[q.id] ? `
                                        <div class="mt-6 pt-6 border-t border-slate-100">
                                            <div class="bg-indigo-50/50 rounded-xl p-4 flex gap-3">
                                                <i data-lucide="help-circle" class="text-indigo-500 shrink-0 mt-0.5 w-5 h-5"></i>
                                                <div>
                                                    <h4 class="text-sm font-bold text-indigo-900 mb-1">解析</h4>
                                                    <p class="text-sm text-indigo-700 leading-relaxed">${q.explanation}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ` : ''}
                                </div>
                            </div>
                        `;
                    }).join('') : `
                        <div class="p-20 text-center bg-white rounded-3xl border border-dashed border-slate-300">
                            <div class="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                                <i data-lucide="help-circle" class="w-8 h-8"></i>
                            </div>
                            <h3 class="text-lg font-bold text-slate-800 mb-2">未找到符合条件的题目</h3>
                            <p class="text-slate-400">请尝试更改筛选条件或重置练习。</p>
                        </div>
                    `}
                </div>
            </div>
        `;
    }

    // --- Search Logic ---
    function openSearch() {
        searchOverlay.classList.remove('hidden');
        searchInput.focus();
    }

    function closeSearch() {
        searchOverlay.classList.add('hidden');
        searchInput.value = '';
        searchResults.innerHTML = '';
    }

    function handleSearchInput(e) {
        const query = e.target.value.trim().toLowerCase();
        if (!query) {
            searchResults.innerHTML = '';
            return;
        }

        const all = [
            ...geographyData.map(v => ({ ...v, subject: 'geo' })),
            ...biologyData.map(v => ({ ...v, subject: 'bio' }))
        ];

        const matched = [];
        for (const vol of all) {
            for (const sec of vol.sections) {
                if (
                    sec.title.toLowerCase().includes(query) ||
                    sec.content.toLowerCase().includes(query) ||
                    sec.tags.some(t => t.toLowerCase().includes(query))
                ) {
                    matched.push({
                        subject: vol.subject,
                        volumeId: vol.id,
                        volumeName: vol.name,
                        sectionId: sec.id,
                        sectionTitle: sec.title
                    });
                }
            }
        }

        const results = matched.slice(0, 8);
        if (results.length > 0) {
            searchResults.innerHTML = results.map(res => `
                <button onclick="handleSearchResultClick('${res.subject}', '${res.volumeId}', '${res.sectionId}')" class="w-full flex items-center justify-between p-4 hover:bg-slate-50 rounded-xl transition-colors group text-left">
                    <div>
                        <div class="flex items-center gap-2 mb-1">
                            <span class="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-tighter ${res.subject === 'geo' ? 'bg-indigo-100 text-indigo-600' : 'bg-emerald-100 text-emerald-600'}">
                                ${res.subject === 'geo' ? '地理' : '生物'}
                            </span>
                            <span class="text-xs text-slate-400">${res.volumeName}</span>
                        </div>
                        <div class="text-slate-800 font-medium">${res.sectionTitle}</div>
                    </div>
                    <i data-lucide="arrow-right" class="text-slate-300 group-hover:text-indigo-500 transition-colors w-4.5 h-4.5"></i>
                </button>
            `).join('');
        } else {
            searchResults.innerHTML = '<div class="p-12 text-center text-slate-400">未找到相关内容，请尝试其他关键词</div>';
        }
        lucide.createIcons();
    }

    // --- Global Handlers (attached to window) ---
    window.navigateTo = (subject, volumeId) => {
        setState({ activeSubject: subject, activeVolumeId: volumeId });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.handleSearchResultClick = (subject, volumeId, sectionId) => {
        closeSearch();
        setState({ activeSubject: subject, activeVolumeId: volumeId });
        setTimeout(() => {
            const el = document.getElementById(sectionId);
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    };

    window.handlePracticeAnswer = (qId, optionIdx) => {
        if (state.userAnswers[qId] !== undefined) return;
        const newUserAnswers = { ...state.userAnswers, [qId]: optionIdx };
        const newShowExplanations = { ...state.showExplanations, [qId]: true };
        setState({ userAnswers: newUserAnswers, showExplanations: newShowExplanations });
    };

    window.resetPractice = () => {
        setState({ userAnswers: {}, showExplanations: {} });
    };

    window.updatePracticeFilter = (type, value) => {
        if (type === 'subject') setState({ selectedPracticeSubject: value });
        else if (type === 'difficulty') setState({ selectedPracticeDifficulty: value });
    };

    // --- Start ---
    init();
})();
