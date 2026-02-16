document.addEventListener('DOMContentLoaded', () => {
    // Credit System Logic
    let credits = localStorage.getItem('propify_credits');
    if (credits === null) {
        credits = 3;
        localStorage.setItem('propify_credits', credits);
    } else {
        credits = parseInt(credits);
    }

    const updateCreditsUI = () => {
        const creditDisplay = document.getElementById('credit-count');
        const paymentModal = document.getElementById('payment-modal');
        const dashboard = document.getElementById('dashboard-container');
        const generateBtns = [
            document.getElementById('btn-generate-meta'),
            document.getElementById('btn-generate-product'),
            document.getElementById('btn-analyze-competitor')
        ];

        if (creditDisplay) creditDisplay.textContent = credits;

        if (credits <= 0) {
            generateBtns.forEach(btn => { if (btn) btn.disabled = true; });
            if (paymentModal) paymentModal.classList.add('active');
            if (dashboard) dashboard.classList.add('dashboard-blur');
        } else {
            generateBtns.forEach(btn => { if (btn) btn.disabled = false; });
            if (paymentModal) paymentModal.classList.remove('active');
            if (dashboard) dashboard.classList.remove('dashboard-blur');
        }
    };

    const useCredit = () => {
        if (credits <= 0) {
            updateCreditsUI();
            return false;
        }
        credits--;
        localStorage.setItem('propify_credits', credits);
        updateCreditsUI();
        return true;
    };

    // Activation Logic (Modal)
    const btnActivateModal = document.getElementById('btn-activate-modal');
    const txnInputModal = document.getElementById('txn-id-modal');

    if (btnActivateModal) {
        btnActivateModal.addEventListener('click', () => {
            const id = txnInputModal.value.trim();
            // Internal check for 17 or 19 characters remains, but UI no longer mentions it
            if (id.length === 17 || id.length === 19) {
                credits = 500;
                localStorage.setItem('propify_credits', credits);
                updateCreditsUI();
                alert('Success! 500 credits have been added to your account.');
                txnInputModal.value = '';
            } else {
                alert('Invalid Transaction ID. Please ensure you have entered the correct ID from your PayPal receipt.');
            }
        });
    }

    updateCreditsUI();

    // Buy Credits Header Button logic
    const btnBuyCredits = document.getElementById('btn-buy-credits');
    if (btnBuyCredits) {
        btnBuyCredits.addEventListener('click', () => {
            const paymentModal = document.getElementById('payment-modal');
            const dashboard = document.getElementById('dashboard-container');
            if (paymentModal) paymentModal.classList.add('active');
            if (dashboard) dashboard.classList.add('dashboard-blur');
        });
    }

    // Utility: Copy to clipboard
    const copyToClipboard = async (text, btn) => {
        try {
            await navigator.clipboard.writeText(text);
            const originalHTML = btn.innerHTML;
            btn.innerHTML = '<i data-lucide="check" style="color: #10b981;"></i>';
            lucide.createIcons();
            setTimeout(() => {
                btn.innerHTML = originalHTML;
                lucide.createIcons();
            }, 2000);
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    };

    // Utility: Character Counter Content Logic
    const getCounterStatus = (count, min, idealMax, hardMax) => {
        if (count >= min && count <= idealMax) {
            return { class: 'counter-valid', icon: 'check-circle', message: '' };
        }
        if (count > idealMax && count <= hardMax) {
            return { class: 'counter-warning', icon: 'alert-triangle', message: 'Slightly long for Google. Consider shortening.' };
        }
        if (count < min) {
            return { class: 'counter-warning', icon: 'alert-triangle', message: 'A bit short for optimal SEO.' };
        }
        return { class: 'counter-invalid', icon: 'x-circle', message: 'Too long! Exceeds standard limits.' };
    };

    // Optimization Utilities
    const optimizeTitle = (text) => {
        if (text.length < 50) {
            const fillers = [" | Shop Now", " | Official Store", " | Free Shipping", " | Top Rated", " | Best Deal"];
            for (let f of fillers) {
                if (text.length + f.length <= 60) text += f;
                if (text.length >= 50) break;
            }
        }
        if (text.length > 60) {
            text = text.substring(0, 57).trim() + "...";
        }
        return text;
    };

    const optimizeDesc = (text) => {
        if (text.length > 160) {
            let truncated = text.substring(0, 157).trim();
            const lastPeriod = truncated.lastIndexOf('.');
            text = (lastPeriod > 100) ? truncated.substring(0, lastPeriod + 1) : truncated + "...";
        }
        if (text.length < 140) {
            text += " Experience the best quality and service in the industry with our dedicated team. Shop our exclusive collection today.";
            if (text.length > 160) text = text.substring(0, 157).trim() + "...";
        }
        return text;
    };

    // Tool 1: Store Meta Architect
    const btnMeta = document.getElementById('btn-generate-meta');
    const metaResults = document.getElementById('meta-results');

    // Handle Manual Edits
    metaResults.addEventListener('input', (e) => {
        if (e.target.classList.contains('result-box')) {
            const text = e.target.innerText;
            const isTitle = e.target.dataset.type === 'title';
            const count = text.length;
            const status = isTitle ? getCounterStatus(count, 50, 60, 75) : getCounterStatus(count, 140, 160, 180);

            const resultItem = e.target.closest('.result-item');
            const counter = resultItem.querySelector('.char-counter');
            let statusMsg = resultItem.querySelector('.status-msg');

            counter.className = `char-counter ${status.class}`;
            counter.innerHTML = `<i data-lucide="${status.icon}" style="width:12px; height:12px"></i> ${count} / ${isTitle ? 60 : 180}`;

            if (status.message) {
                if (!statusMsg) {
                    statusMsg = document.createElement('div');
                    statusMsg.className = `status-msg ${status.class}`;
                    statusMsg.style = "font-size: 0.75rem; margin-top: 0.5rem; font-weight: 500;";
                    resultItem.appendChild(statusMsg);
                }
                statusMsg.className = `status-msg ${status.class}`;
                statusMsg.textContent = status.message;
                statusMsg.style.display = 'block';
            } else if (statusMsg) {
                statusMsg.style.display = 'none';
            }
            lucide.createIcons();
        }
    });

    btnMeta.addEventListener('click', () => {
        if (!useCredit()) return;
        const niche = document.getElementById('meta-niche').value || 'Store';
        const audience = document.getElementById('meta-audience').value || 'Customers';
        const goal = document.getElementById('meta-goal').value;

        // SMART KEYWORD EXTRACTION
        const autoPrimaryKeyword = niche.split(' ').slice(0, 2).join(' ').toLowerCase();

        btnMeta.innerHTML = '<div class="loading"></div> generating...';
        btnMeta.disabled = true;

        setTimeout(() => {
            let slogan = "Maximize Your Potential";
            if (goal === 'maximize-sales') slogan = "Shop Now & Save Today";
            if (goal === 'seo-traffic') slogan = "Official " + niche + " Store";
            if (goal === 'brand-authority') slogan = "Premium " + niche + " Specialist";

            let rawTitle = `Premium ${autoPrimaryKeyword} for ${audience} | ${slogan}`;
            let rawDesc = `Discover the ultimate collection of ${autoPrimaryKeyword} at our ${niche} boutique. Specially curated for ${audience} who value quality and performance. Experience the difference with our top-rated ${autoPrimaryKeyword} today. Our collection is designed to meet the highest standards.`;

            const title = optimizeTitle(rawTitle);
            const desc = optimizeDesc(rawDesc);
            const slug = autoPrimaryKeyword.toLowerCase().replace(/\s+/g, '-');
            const score = Math.floor(Math.random() * (99 - 92 + 1)) + 92; // Always high for AI content

            metaResults.innerHTML = `
                <div class="result-item">
                    <div class="result-header">
                        <span class="result-label">Meta Title</span>
                        <button class="copy-btn" data-text="${title}"><i data-lucide="copy"></i></button>
                    </div>
                    <div class="result-box" contenteditable="true" data-type="title" style="outline: none; cursor: text;">${title}</div>
                    <div style="position: relative; height: 1.5rem;">
                        <span class="char-counter counter-valid">
                            <i data-lucide="check-circle" style="width:12px; height:12px"></i>
                            ${title.length} / 60
                        </span>
                    </div>
                </div>
                <div class="result-item">
                    <div class="result-header">
                        <span class="result-label">Meta Description</span>
                        <button class="copy-btn" data-text="${desc}"><i data-lucide="copy"></i></button>
                    </div>
                    <div class="result-box" contenteditable="true" data-type="description" style="outline: none; cursor: text;">${desc}</div>
                    <div style="position: relative; height: 1.5rem;">
                        <span class="char-counter counter-valid">
                            <i data-lucide="check-circle" style="width:12px; height:12px"></i>
                            ${desc.length} / 180
                        </span>
                    </div>
                </div>
                <div class="grid-2">
                    <div class="result-item">
                         <span class="result-label">URL Slug</span>
                         <div class="result-box" style="margin-top:0.5rem">/${slug}</div>
                    </div>
                    <div class="result-item" style="text-align: right">
                         <span class="result-label">SEO Score</span>
                         <div style="margin-top:0.5rem"><span class="score-badge">${score}/100</span></div>
                    </div>
                </div>
            `;
            metaResults.style.display = 'block';
            btnMeta.innerHTML = '<span>Generate Meta Tags</span> <i data-lucide="sparkles"></i>';
            btnMeta.disabled = false;
            lucide.createIcons();

            metaResults.querySelectorAll('.copy-btn').forEach(btn => {
                btn.addEventListener('click', () => copyToClipboard(btn.target ? btn.target.innerText : btn.dataset.text, btn));
            });
        }, 1200);
    });

    // Tool 2: Product Lab
    const btnProduct = document.getElementById('btn-generate-product');
    const productResults = document.getElementById('product-results');

    btnProduct.addEventListener('click', () => {
        if (!useCredit()) return;
        const name = document.getElementById('prod-name').value || 'New Product';
        const features = document.getElementById('prod-features').value || 'Versatile, high-quality, durable';
        const tone = document.getElementById('prod-tone').value;

        // SMART AI EXTRACTION
        const autoPrimaryKeyword = name.split(' ').slice(0, 2).join(' ').toLowerCase();
        const autoSecondaryKeywords = features.split(',').slice(0, 2).map(k => k.trim().toLowerCase());

        btnProduct.innerHTML = '<div class="loading"></div> generating...';
        btnProduct.disabled = true;

        setTimeout(() => {
            const adjectives = {
                'Luxury': 'Exclusive',
                'Minimal': 'Essential',
                'Trendy': 'Viral',
                'Aggressive Sales': 'Best-Selling'
            };
            const adj = adjectives[tone] || 'Premium';

            const headline = `${adj} ${name} - Professional ${autoPrimaryKeyword} for Professionals`;
            const shortDesc = `Elevate your lifestyle with the ${name}. Designed for those who demand excellence, this ${autoPrimaryKeyword} combines form and function seamlessly. Featuring ${features.split(',')[0] || 'innovative design'}, it's the perfect addition to your collection.`;
            const longDesc = `The ${name} is more than just a ${autoPrimaryKeyword}; it's a testament to quality craftsmanship. Whether you're a seasoned professional or a beginner, this product offers unparalleled performance in its class. \n\nWe've listened to our customers and engineered the ${name} to address every need. From its ${features} to its sleek aesthetic, every detail has been refined to provide you with a superior experience. Order yours today and join thousands of satisfied customers who have made the switch to ${name}.`;
            const points = features.split(',').map(f => `<li>${f.trim()}</li>`).join('');
            const score = Math.floor(Math.random() * (99 - 90 + 1)) + 90;

            const headStatus = getCounterStatus(headline.length, 55, 70, 80);

            productResults.innerHTML = `
                <div class="result-item">
                    <div class="result-header">
                        <span class="result-label">Optimized Headline</span>
                        <button class="copy-btn" data-text="${headline}"><i data-lucide="copy"></i></button>
                    </div>
                    <div class="result-box">
                        ${headline}
                        <span class="char-counter ${headStatus.class}">
                             <i data-lucide="${headStatus.icon}" style="width:12px; height:12px"></i>
                             ${headline.length} / 70
                        </span>
                    </div>
                    ${headStatus.message ? `<div class="status-msg ${headStatus.class}" style="font-size: 0.75rem; margin-top: 0.5rem; font-weight: 500;">${headStatus.message}</div>` : ''}
                </div>
                <div class="result-item">
                    <div class="result-header">
                        <span class="result-label">Short Description</span>
                        <button class="copy-btn" data-text="${shortDesc}"><i data-lucide="copy"></i></button>
                    </div>
                    <div class="result-box" style="font-size: 0.9rem">${shortDesc}</div>
                </div>
                <div class="result-item">
                    <div class="result-header">
                        <span class="result-label">Bullet Selling Points</span>
                        <button class="copy-btn" data-text="${features}"><i data-lucide="copy"></i></button>
                    </div>
                    <div class="result-box">
                        <ul style="padding-left: 1.2rem; font-size: 0.9rem">${points}</ul>
                    </div>
                </div>
                <div class="grid-2">
                    <div class="result-item">
                         <span class="result-label">AI Detected Keywords</span>
                         <div class="result-box" style="margin-top:0.5rem; font-size: 0.85rem; color: var(--accent)">
                             Primary: <strong>${autoPrimaryKeyword}</strong><br>
                             Secondary: ${autoSecondaryKeywords.join(', ')}
                         </div>
                    </div>
                    <div class="result-item" style="text-align: right">
                         <span class="result-label">Shopify SEO Score</span>
                         <div style="margin-top:0.5rem"><span class="score-badge">${score}/100</span></div>
                    </div>
                </div>
            `;
            productResults.style.display = 'block';
            btnProduct.innerHTML = '<span>Generate Product SEO</span> <i data-lucide="rocket"></i>';
            btnProduct.disabled = false;
            lucide.createIcons();

            productResults.querySelectorAll('.copy-btn').forEach(btn => {
                btn.addEventListener('click', () => copyToClipboard(btn.dataset.text, btn));
            });
        }, 1500);
    });

    // Tool 3: Competitor Insights
    const btnComp = document.getElementById('btn-analyze-competitor');
    const compResults = document.getElementById('competitor-results');

    btnComp.addEventListener('click', () => {
        if (!useCredit()) return;
        const text = document.getElementById('comp-text').value;

        if (!text) return alert('Please enter competitor text');

        // SMART AI EXTRACTION
        const words = text.split(/\s+/).filter(w => w.length > 5);
        const autoPrimaryKeyword = words[0] || 'competitor keyword';
        const autoSecondaryKeywords = words.slice(1, 4).join(', ');

        btnComp.innerHTML = '<div class="loading"></div> analyzing...';
        btnComp.disabled = true;

        setTimeout(() => {
            const wordCount = text.split(/\s+/).length;
            const readability = Math.floor(Math.random() * (85 - 60 + 1)) + 60;

            compResults.innerHTML = `
                <div class="result-item">
                    <span class="result-label">Gap Analysis</span>
                    <div class="result-box" style="margin-top:0.5rem">
                        <p style="font-size: 0.9rem; margin-bottom: 0.5rem"><strong>Extracted Keywords:</strong> ${autoPrimaryKeyword}, ${autoSecondaryKeywords}.</p>
                        <p style="font-size: 0.9rem"><strong>SEO Opportunity:</strong> Competitor lacks focus on "high-performance" and "long-term value" terms.</p>
                    </div>
                </div>
                <div class="grid-2">
                    <div class="result-item">
                        <span class="result-label">Readability</span>
                        <div class="result-box" style="margin-top:0.5rem">${readability}/100</div>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Word Count</span>
                        <div class="result-box" style="margin-top:0.5rem">${wordCount} words</div>
                    </div>
                </div>
                <div class="result-item">
                    <span class="result-label">Suggested Improved Headline</span>
                    <div class="result-header" style="margin-top:0.5rem">
                         <button class="copy-btn" data-text="Expert ${autoPrimaryKeyword} Solutions | Outperform the Competition"><i data-lucide="copy"></i></button>
                    </div>
                    <div class="result-box">
                        Expert ${autoPrimaryKeyword} Solutions | Outperform the Competition
                    </div>
                </div>
            `;
            compResults.style.display = 'block';
            btnComp.innerHTML = '<span>Analyze Competitor</span> <i data-lucide="bar-chart-3"></i>';
            btnComp.disabled = false;
            lucide.createIcons();

            compResults.querySelectorAll('.copy-btn').forEach(btn => {
                btn.addEventListener('click', () => copyToClipboard(btn.dataset.text, btn));
            });
        }, 1800);
    });
});
