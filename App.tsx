import React, { useState, useEffect, useCallback } from 'react';
import { Profile, PraiseStyle, SpecialOccasion } from './types.ts';
import { useLocalStorage } from './hooks/useLocalStorage.ts';
import { generatePraise } from './services/geminiService.ts';
import { SparklesIcon, HeartIcon, ShareIcon, TrashIcon, CloseIcon, CopyIcon, WhatsappIcon, InstagramIcon, TwitterIcon } from './components/Icons.tsx';
import { Confetti } from './components/Confetti.tsx';
import { BottomNav } from './components/BottomNav.tsx';
import { PWAInstallPrompt } from './components/PWAInstallPrompt.tsx';
import { AboutScreen } from './components/AboutScreen.tsx';

type View = 'praise' | 'favorites' | 'profile' | 'about';

const App: React.FC = () => {
    const [profile, setProfile] = useLocalStorage<Profile | null>('beni-ov-profile', null);
    const [favorites, setFavorites] = useLocalStorage<string[]>('beni-ov-favorites', []);
    const [currentPraise, setCurrentPraise] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [currentView, setCurrentView] = useState<View>('praise');
    const [notification, setNotification] = useState<string | null>(null);
    const [praiseToDelete, setPraiseToDelete] = useState<string | null>(null);
    const [praiseToShare, setPraiseToShare] = useState<string | null>(null);
    const [showConfetti, setShowConfetti] = useState(false);
    const [showPWAPrompt, setShowPWAPrompt] = useState(false);

    // PWA Prompt'u 3 saniye sonra göster
    useEffect(() => {
        const timer = setTimeout(() => {
            const dismissed = localStorage.getItem('pwa-prompt-dismissed');
            const lastShown = localStorage.getItem('pwa-prompt-last-shown');
            const now = Date.now();
            
            if (dismissed && lastShown && (now - parseInt(lastShown)) < 24 * 60 * 60 * 1000) {
                return;
            }
            
            setShowPWAPrompt(true);
        }, 3000);
        
        return () => clearTimeout(timer);
    }, []);

    const handleDismissPWA = () => {
        setShowPWAPrompt(false);
        localStorage.setItem('pwa-prompt-dismissed', 'true');
        localStorage.setItem('pwa-prompt-last-shown', Date.now().toString());
    };

    const handleGeneratePraise = useCallback(async () => {
        if (!profile) return;
        setCurrentView('praise'); // Övgü ekranına geç
        setIsLoading(true);
        setError(null);
        try {
            const newPraise = await generatePraise(profile, [...favorites, currentPraise]);
            setCurrentPraise(newPraise);
            setShowConfetti(true);
        } catch (err: any) {
            setError(err.message || 'Bir şeyler ters gitti.');
        } finally {
            setIsLoading(false);
        }
    }, [profile, favorites, currentPraise]);

    useEffect(() => {
        if (profile && !currentPraise) {
            handleGeneratePraise();
        }
    }, [profile]);

    const showNotification = (message: string) => {
        setNotification(message);
        setTimeout(() => setNotification(null), 2500);
    };

    const handleSaveProfile = (newProfile: Profile) => {
        if(newProfile.praiseStyle !== profile?.praiseStyle || 
           newProfile.specialOccasion !== profile?.specialOccasion ||
           !currentPraise || 
           newProfile.name !== profile.name) {
             setCurrentPraise(''); 
        }
        setProfile(newProfile);
        setCurrentView('praise');
    };
    
    const handleAddToFavorites = () => {
        if (currentPraise && !favorites.includes(currentPraise)) {
            setFavorites([currentPraise, ...favorites]);
            showNotification("Favorilere eklendi!");
        }
    };
    
    const handleRemoveFromFavorites = (praiseToRemove: string) => {
        setFavorites(favorites.filter(p => p !== praiseToRemove));
        showNotification("Favorilerden kaldırıldı.");
    };

    const requestShare = (text: string) => {
        if (!text) return;
        setPraiseToShare(text);
    };

    const requestDelete = (text: string) => {
        setPraiseToDelete(text);
    };

    const confirmDelete = () => {
        if (praiseToDelete) {
            handleRemoveFromFavorites(praiseToDelete);
            setPraiseToDelete(null);
        }
    };
    
    const renderContent = () => {
        if (!profile) {
            return <ProfileScreen onSave={handleSaveProfile} />;
        }
        
        switch(currentView) {
            case 'praise':
                return <PraiseScreen 
                          praise={currentPraise} 
                          isLoading={isLoading} 
                          error={error}
                          isFavorited={favorites.includes(currentPraise)}
                          onGenerate={handleGeneratePraise} 
                          onFavorite={handleAddToFavorites}
                          onShare={() => requestShare(currentPraise)} />;
            case 'favorites':
                return <FavoritesScreen 
                          favorites={favorites} 
                          onRemove={requestDelete}
                          onShare={requestShare} />;
            case 'profile':
                 return <ProfileScreen onSave={handleSaveProfile} currentProfile={profile} />;
            case 'about':
                return <AboutScreen />;
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex flex-col items-center justify-center p-4 pb-20 selection:bg-purple-500/30">
            <main className="w-full max-w-md mb-4">
                {renderContent()}
            </main>
            
            <BottomNav currentView={currentView} onViewChange={setCurrentView} />
            {showConfetti && <Confetti onComplete={() => setShowConfetti(false)} />}
            {showPWAPrompt && <PWAInstallPrompt onDismiss={handleDismissPWA} />}
            {praiseToShare && <ShareModal text={praiseToShare} onClose={() => setPraiseToShare(null)} showNotification={showNotification} />}
            {praiseToDelete && <ConfirmationModal message="Bu favori övgüyü silmek istediğinizden emin misiniz?" onConfirm={confirmDelete} onCancel={() => setPraiseToDelete(null)} />}
            {notification && <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-full shadow-lg animate-bounce z-50">{notification}</div>}
            
            {!profile && (
                <footer className="fixed bottom-4 left-0 right-0 text-center text-xs text-gray-500 z-10">
                    <a href="https://gemini.google.com/" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 transition-colors">
                        Yapay Zeka ile ❤️ ile kodlandı
                    </a>
                </footer>
            )}
        </div>
    );
};

interface PlaceholderScreenProps {
    title: string;
    icon: string;
    message: string;
}
const PlaceholderScreen: React.FC<PlaceholderScreenProps> = ({ title, icon, message }) => (
    <div className="bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl p-8 w-full max-w-md text-center shadow-2xl shadow-purple-500/10 min-h-[400px] flex flex-col items-center justify-center">
        <div className="text-6xl mb-4">{icon}</div>
        <h2 className="text-2xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">{title}</h2>
        <p className="text-gray-400">{message}</p>
    </div>
);

interface ProfileScreenProps {
    onSave: (profile: Profile) => void;
    currentProfile?: Profile;
}
const ProfileScreen: React.FC<ProfileScreenProps> = ({ onSave, currentProfile }) => {
    const [name, setName] = useState(currentProfile?.name || '');
    const [age, setAge] = useState(currentProfile?.age?.toString() || '');
    const [gender, setGender] = useState<Profile['gender'] | ''>(currentProfile?.gender || '');
    const [praiseStyle, setPraiseStyle] = useState<PraiseStyle>(currentProfile?.praiseStyle || 'motivational');
    const [specialOccasion, setSpecialOccasion] = useState<SpecialOccasion>(currentProfile?.specialOccasion || 'none');
    const [error, setError] = useState<string>('');

    const styleOptions = [
        { id: 'motivational' as PraiseStyle, label: 'Motive Edici', color: 'bg-gradient-to-r from-purple-500 to-purple-600' },
        { id: 'humorous' as PraiseStyle, label: 'Esprili', color: 'bg-gradient-to-r from-yellow-500 to-orange-500' },
        { id: 'loving' as PraiseStyle, label: 'Sevgi Dolu', color: 'bg-gradient-to-r from-pink-500 to-red-500' },
        { id: 'heroic' as PraiseStyle, label: 'Kahramanca', color: 'bg-gradient-to-r from-blue-500 to-indigo-600' },
        { id: 'poetic' as PraiseStyle, label: 'Şiirsel', color: 'bg-gradient-to-r from-green-500 to-teal-500' },
        { id: 'sincere' as PraiseStyle, label: 'Samimi', color: 'bg-gradient-to-r from-cyan-500 to-blue-500' },
        { id: 'friendly' as PraiseStyle, label: 'Arkadaşça', color: 'bg-gradient-to-r from-amber-500 to-yellow-500' },
        { id: 'acrostic' as PraiseStyle, label: 'Akrostiş', color: 'bg-gradient-to-r from-violet-500 to-purple-600' }
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const ageNum = parseInt(age, 10);
        if (!name.trim() || !age || !gender) {
            setError("Lütfen (*) ile işaretli tüm zorunlu alanları doldurun.");
            return;
        }
        if (isNaN(ageNum) || ageNum <= 0 || ageNum > 120) {
            setError("Lütfen geçerli bir yaş girin.");
            return;
        }
        setError('');
        onSave({ name: name.trim(), age: ageNum, gender: gender as Profile['gender'], praiseStyle, specialOccasion });
    };

    return (
        <div className="bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl p-8 w-full max-w-md text-center shadow-2xl shadow-purple-500/10">
            <h1 className="text-3xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">Profilin</h1>
            <p className="text-gray-400 mb-6">Sana özel övgüler için bu bilgilere ihtiyacımız var.</p>
            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2 text-left">
                    <label className="font-medium text-gray-300 text-sm">Adın <span className="text-pink-500">*</span></label>
                    <input type="text" placeholder="Adını gir" value={name} onChange={e => setName(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all" />
                </div>
                <div className="space-y-2 text-left">
                    <label className="font-medium text-gray-300 text-sm">Yaşın <span className="text-pink-500">*</span></label>
                    <input type="number" placeholder="Yaşını gir" value={age} onChange={e => setAge(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all" />
                </div>
                <div className="space-y-2 text-left">
                    <label className="font-medium text-gray-300 text-sm">Cinsiyetin <span className="text-pink-500">*</span></label>
                    <select value={gender} onChange={e => setGender(e.target.value as Profile['gender'])} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all">
                        <option value="" disabled className="bg-gray-800">Seç</option>
                        <option value="Kadın" className="bg-gray-800">Kadın</option>
                        <option value="Erkek" className="bg-gray-800">Erkek</option>
                        <option value="Diğer" className="bg-gray-800">Diğer</option>
                    </select>
                </div>
                <div className="space-y-2 text-left">
                    <label className="font-medium text-gray-300 text-sm">Övgü Tarzı <span className="text-pink-500">*</span></label>
                    <select value={praiseStyle} onChange={e => setPraiseStyle(e.target.value as PraiseStyle)} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all">
                        <option value="" disabled className="bg-gray-800">Seç</option>
                        <option value="motivational" className="bg-gray-800">Motive Edici</option>
                        <option value="humorous" className="bg-gray-800">Esprili</option>
                        <option value="loving" className="bg-gray-800">Sevgi Dolu</option>
                        <option value="heroic" className="bg-gray-800">Kahramanca</option>
                        <option value="poetic" className="bg-gray-800">Şiirsel</option>
                        <option value="sincere" className="bg-gray-800">Samimi</option>
                        <option value="friendly" className="bg-gray-800">Arkadaşça</option>
                        <option value="acrostic" className="bg-gray-800">Akrostiş</option>
                    </select>
                </div>
                
                <div className="space-y-3 text-left">
                    <label className="font-medium text-gray-300">Özel Durum (İsteğe Bağlı)</label>
                    <select value={specialOccasion} onChange={e => setSpecialOccasion(e.target.value as SpecialOccasion)} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all">
                        <option value="none" className="bg-gray-800">Yok</option>
                        <optgroup label="👨‍👩‍👧 Aile & İlişkiler" className="bg-gray-800">
                            <option value="mothers_day" className="bg-gray-800">💐 Anneler Günü</option>
                            <option value="fathers_day" className="bg-gray-800">👔 Babalar Günü</option>
                            <option value="valentines_day" className="bg-gray-800">❤️ Sevgililer Günü</option>
                            <option value="wedding" className="bg-gray-800">💒 Düğün</option>
                            <option value="baby_birth" className="bg-gray-800">👶 Bebek Doğumu</option>
                        </optgroup>
                        <optgroup label="🎉 Kutlamalar" className="bg-gray-800">
                            <option value="birthday" className="bg-gray-800">🎂 Doğum Günü</option>
                            <option value="anniversary" className="bg-gray-800">💍 Evlilik Yıldönümü</option>
                            <option value="new_year" className="bg-gray-800">🎆 Yeni Yıl</option>
                        </optgroup>
                        <optgroup label="💼 Başarılar & Kariyer" className="bg-gray-800">
                            <option value="new_job" className="bg-gray-800">💼 Yeni İş</option>
                            <option value="promotion" className="bg-gray-800">📈 Terfi</option>
                            <option value="graduation" className="bg-gray-800">🎓 Mezuniyet</option>
                            <option value="achievement" className="bg-gray-800">🏆 Başarı</option>
                            <option value="teachers_day" className="bg-gray-800">📚 Öğretmenler Günü</option>
                        </optgroup>
                        <optgroup label="✨ Diğer" className="bg-gray-800">
                            <option value="thanks" className="bg-gray-800">🙏 Teşekkür</option>
                        </optgroup>
                    </select>
                </div>
                
                <div className="space-y-3 text-left">
                    <label className="font-medium text-gray-300">Övgü Tarzı Seç</label>
                    <div className="grid grid-cols-2 gap-2">
                        {styleOptions.map(option => (
                            <button type="button" key={option.id} onClick={() => setPraiseStyle(option.id)} className={`w-full py-2.5 rounded-lg transition-all duration-200 text-sm font-semibold transform focus:outline-none ${praiseStyle === option.id ? `${option.color} text-white shadow-lg scale-105` : 'bg-white/5 text-gray-300 hover:bg-white/10'}`}>
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>

                {error && <p className="text-red-400 text-sm">{error}</p>}
                <button type="submit" className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 rounded-lg hover:scale-105 transform transition-all duration-300 shadow-lg shadow-purple-500/30 mt-4">
                    Beni Öv
                </button>
            </form>
        </div>
    );
};

interface PraiseScreenProps {
    praise: string;
    isLoading: boolean;
    error: string | null;
    isFavorited: boolean;
    onGenerate: () => void;
    onFavorite: () => void;
    onShare: () => void;
}
const PraiseScreen: React.FC<PraiseScreenProps> = ({ praise, isLoading, error, isFavorited, onGenerate, onFavorite, onShare }) => (
    <div className="bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center min-h-[400px] text-center shadow-2xl shadow-purple-500/10">
        <div className="flex-grow flex items-center justify-center">
            {isLoading ? (
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-400"></div>
                    <p className="text-gray-400 text-sm animate-pulse">Övgün hazırlanıyor...</p>
                    <p className="text-gray-500 text-xs">Yoğunluk varsa otomatik tekrar deniyor</p>
                </div>
            ) : error ? (
                <p className="text-red-400 text-lg">{error}</p>
            ) : (
                <p className="text-3xl font-semibold leading-relaxed text-gray-100 whitespace-pre-wrap">{praise}</p>
            )}
        </div>
        <div className="flex justify-center items-center gap-4 mt-8 w-full">
            <button onClick={onFavorite} disabled={isLoading || !praise} className={`p-4 rounded-full transition-all duration-300 disabled:opacity-50 ${isFavorited ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/30' : 'bg-white/10 hover:bg-white/20'}`}>
                <HeartIcon className="w-7 h-7" />
            </button>
            <button onClick={onGenerate} disabled={isLoading} className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-4 px-8 rounded-full hover:scale-105 transform transition-all duration-300 shadow-lg shadow-purple-500/30 disabled:opacity-50 flex items-center gap-2">
                <SparklesIcon className="w-6 h-6" />
                <span>Yeni Övgü</span>
            </button>
            <button onClick={onShare} disabled={isLoading || !praise} className="bg-white/10 hover:bg-white/20 p-4 rounded-full transition-all duration-300 disabled:opacity-50">
                <ShareIcon className="w-7 h-7" />
            </button>
        </div>
    </div>
);

interface FavoritesScreenProps {
    favorites: string[];
    onRemove: (praise: string) => void;
    onShare: (praise: string) => void;
}
const FavoritesScreen: React.FC<FavoritesScreenProps> = ({ favorites, onRemove, onShare }) => (
    <div className="bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl shadow-purple-500/10 max-h-[80vh] flex flex-col">
        <h2 className="text-2xl font-bold mb-4 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">Favorilerin</h2>
        {favorites.length === 0 ? <p className="text-gray-400 text-center py-8">Henüz favorin yok.</p> : (
            <ul className="space-y-4 overflow-y-auto flex-grow pr-2">
                {favorites.map((praise, index) => (
                    <li key={index} className="bg-white/5 p-4 rounded-lg flex justify-between items-center gap-2 animate-fade-in">
                        <p className="flex-grow text-gray-200 whitespace-pre-wrap">{praise}</p>
                        <div className="flex-shrink-0 flex gap-2">
                            <button onClick={() => onShare(praise)} className="p-2 text-gray-400 hover:text-purple-400 transition-colors"><ShareIcon className="w-5 h-5" /></button>
                            <button onClick={() => onRemove(praise)} className="p-2 text-gray-400 hover:text-red-400 transition-colors"><TrashIcon className="w-5 h-5" /></button>
                        </div>
                    </li>
                ))}
            </ul>
        )}
    </div>
);

interface ConfirmationModalProps {
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}
const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ message, onConfirm, onCancel }) => (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
        <div className="bg-gray-800 border border-white/10 rounded-2xl p-8 w-full max-w-sm text-center shadow-2xl shadow-purple-500/20">
            <p className="text-lg mb-6 text-gray-200">{message}</p>
            <div className="flex justify-center gap-4">
                <button onClick={onCancel} className="px-6 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors">İptal</button>
                <button onClick={onConfirm} className="px-6 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors font-semibold">Sil</button>
            </div>
        </div>
    </div>
);

interface ShareModalProps {
    text: string;
    onClose: () => void;
    showNotification: (message: string) => void;
}
const ShareModal: React.FC<ShareModalProps> = ({ text, onClose, showNotification }) => {
    const handleCopy = () => {
        navigator.clipboard.writeText(`"${text}"`);
        showNotification("Övgü panoya kopyalandı!");
        onClose();
    };

    const shareOn = (platform: 'whatsapp' | 'twitter' | 'facebook' | 'instagram') => {
        const appUrl = window.location.origin;
        const fullText = `"${text}"\n\n✨ Beni Öv uygulamasından\n${appUrl}`;
        const encodedText = encodeURIComponent(fullText);
        let url = '';
        
        if (platform === 'instagram') {
            navigator.clipboard.writeText(`${text}\n\n✨ Beni Öv: ${appUrl}`);
            showNotification("Metin kopyalandı. Instagram'da yapıştırabilirsiniz.");
            url = 'https://www.instagram.com';
            window.open(url, '_blank', 'noopener,noreferrer');
            return;
        }

        switch(platform) {
            case 'whatsapp':
                url = `https://api.whatsapp.com/send?text=${encodedText}`;
                break;
            case 'twitter':
                url = `https://twitter.com/intent/tweet?text=${encodedText}`;
                break;
            case 'facebook':
                url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(appUrl)}&quote=${encodedText}`;
                break;
        }
        window.open(url, '_blank', 'noopener,noreferrer');
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-gray-800 border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl shadow-purple-500/20" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">Paylaş</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors"><CloseIcon className="w-6 h-6" /></button>
                </div>
                <div className="bg-white/5 p-4 rounded-lg mb-4 max-h-32 overflow-y-auto">
                    <p className="text-gray-200 text-sm whitespace-pre-wrap">{text}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <button onClick={handleCopy} className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white py-3 rounded-lg transition-colors">
                        <CopyIcon className="w-5 h-5" /><span>Kopyala</span>
                    </button>
                    <button onClick={() => shareOn('whatsapp')} className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg transition-colors">
                        <WhatsappIcon className="w-5 h-5" /><span>WhatsApp</span>
                    </button>
                    <button onClick={() => shareOn('instagram')} className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-3 rounded-lg transition-colors">
                        <InstagramIcon className="w-5 h-5" /><span>Instagram</span>
                    </button>
                    <button onClick={() => shareOn('twitter')} className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg transition-colors">
                        <TwitterIcon className="w-5 h-5" /><span>Twitter</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default App;
