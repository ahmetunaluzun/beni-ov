import { GoogleGenAI } from "@google/genai";
import { Profile, PraiseStyle } from '../types.ts';

// API key'i farklı kaynaklardan deneyerek al
const getApiKey = () => {
  // 1. Önce process.env'den dene
  if (typeof process !== 'undefined' && process.env?.API_KEY) {
    return process.env.API_KEY;
  }
  
  // 2. import.meta.env'den dene (Vite için)
  if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_KEY) {
    return import.meta.env.VITE_API_KEY;
  }
  
  // 3. Global variable'dan dene
  if (typeof window !== 'undefined' && (window as any).__API_KEY__) {
    return (window as any).__API_KEY__;
  }
  
  console.error("API_KEY environment variable not set.");
  return '';
};

const apiKey = getApiKey();

if (!apiKey) {
  console.error("⚠️ HATA: Gemini API Key bulunamadı!");
  console.error("Vercel Dashboard → Settings → Environment Variables");
  console.error("API_KEY değişkenini ekleyin ve redeploy yapın.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || 'dummy-key' });

export async function generatePraise(profile: Profile, existingPraises: string[]): Promise<string> {
  const { name, age, gender, praiseStyle, specialOccasion } = profile;

  const specialOccasionTexts: Record<string, string> = {
    none: '',
    birthday: '🎂 BUGÜN ÖZEL BİR GÜN! Doğum günü kutlaması olmalı. Yaş gününü kutla ve gelecek yıl için en güzel dileklerde bulun.',
    mothers_day: '💐 ANNELER GÜNÜ! Annelik kutlaması. Annenin değerini, fedakarlığını ve sevgisini öv. Minnettarlığını göster.',
    fathers_day: '👔 BABALAR GÜNÜ! Babalık kutlaması. Babanın gücünü, desteğini ve rehberliğini öv. Teşekkürlerini sun.',
    valentines_day: '❤️ SEVGİLİLER GÜNÜ! Aşk ve sevgi kutlaması. Romantik, tutkulu ve sevgi dolu ol. İlişkinizi ve sevginizi öv.',
    new_year: '🎆 YENI YIL KUTLAMASI! Yeni yıl coşkusu. Geçen yılı değerlendir, yeni yıl için umut ver ve başarılar dile.',
    wedding: '💒 DÜĞÜN GÜNÜ! Evlilik kutlaması. Birlikteliği, aşkı ve yeni hayatı kutla. En güzel dileklerde bulun.',
    anniversary: '💍 ÖZEL BİR YIL DÖNÜMÜ! Evlilik yıldönümü veya özel bir yıldönümü kutlaması. Birlikteliği ve aşkı kutla.',
    baby_birth: '👶 YENİ BİR HAYAT! Bebek doğumu kutlaması. Anne/baba olmayı, yeni hayatı ve mutluluğu kutla.',
    promotion: '📈 TERFİ MÜJDESI! Kariyer yükselişi kutlaması. Başarıyı, çabayı ve liyakati öv. Yeni pozisyonda başarılar dile.',
    teachers_day: '📚 ÖĞRETMENLER GÜNÜ! Öğretmenlik mesleğini kutla. Eğitimin ve öğretmenin değerini öv. Minnettarlığını göster.',
    thanks: '🙏 TEŞEKKÜR! Özel bir teşekkür mesajı. Minnettarlığını, takdirini ve şükranını samimi şekilde ifade et.',
    new_job: '💼 YENİ BİR BAŞLANGIÇ! Yeni işine başladı. Kariyer başarısını kutla ve yeni yolculuğunda başarılar dile.',
    graduation: '🎓 MEZUNIYET COŞKUSU! Mezun oldu. Başarısını kutla ve gelecekteki hedefleri için güç ver.',
    achievement: '🏆 BÜYÜK BAŞARI! Önemli bir başarı elde etti. Emeğini ve başarısını özel olarak kutla.'
  };

  const specialText = specialOccasion && specialOccasion !== 'none' 
    ? specialOccasionTexts[specialOccasion] 
    : '';

  const styleInstructions: Record<PraiseStyle, { name: string; description: string }> = {
    motivational: {
      name: 'Motive Edici',
      description: "Övgü, ilham verici, motive edici ve kişiye özel hissettirmeli. Yaşına ve ismine uygun bir tonda olmalı."
    },
    humorous: {
      name: 'Esprili ve Zekice',
      description: "Övgü, zekice ve esprili bir dilde olmalı. Kişiyi güldürmeyi amaçlamalı ama asla rencide edici veya küçümseyici olmamalı. Pozitif ve nazik bir mizah anlayışı kullan."
    },
    loving: {
      name: 'Sevgi Dolu',
      description: "Övgü, son derece samimi, sıcak ve sevgi dolu bir dilde olmalı. Kişinin değerli ve sevilen biri olduğunu hissettirmeli. Şefkatli ve içten bir ton kullan."
    },
    heroic: {
      name: 'Kahramanca',
      description: "Övgü, kişinin gücünü, cesaretini ve potansiyelini bir kahraman gibi yüceltmeli. Epik, görkemli ve güçlü bir dil kullanılmalı."
    },
    poetic: {
      name: 'Şiirsel',
      description: "Övgü, sanatsal, edebi ve şiirsel bir üslupla yazılmalı. Mecazlar, benzetmeler ve estetik bir dil kullanarak derin bir anlam yarat."
    },
    sincere: {
        name: 'Samimi',
        description: "Övgü, yapmacıksız, içten ve dürüst olmalı. Süslü kelimeler yerine doğrudan kalpten gelen, gerçekçi ve anlamlı bir takdir ifadesi kullan. Kişinin karakterine veya eylemlerine odaklanabilirsin."
    },
    friendly: {
        name: 'Arkadaşça',
        description: "Övgü, sanki yakın bir arkadaş söylüyormuş gibi rahat, samimi ve destekleyici bir tonda olmalı. 'Dostum', 'kanka' gibi ifadeler olmadan, doğal bir muhabbet havası yakala. Hafif esprili ama ana odağı pozitif destek olan bir dil kullan."
    },
    acrostic: {
        name: 'Akrostiş',
        description: "Övgü, kişinin isminin baş harflerinden oluşan bir akrostiş şiir şeklinde olmalı. Her mısra, kişinin pozitif bir özelliğini veya ona yönelik güzel bir dileği yansıtmalı. Anlamlı ve yaratıcı olmalı."
    }
  };

  const selectedStyle = styleInstructions[praiseStyle];
  let prompt: string;

  if (praiseStyle === 'acrostic') {
    prompt = `
      Bana "${name}" ismiyle Türkçe bir akrostiş şiir yaz.
      - Kişi hakkında bilgiler: Yaş: ${age}, Cinsiyet: ${gender}
      - İstenen Üslup: Akrostiş (Şiirsel, anlamlı ve iltifat edici)
      ${specialText ? `\n      - ÖZEL DURUM: ${specialText}` : ''}

      Kurallar:
      1. ${selectedStyle.description}
      2. Her mısra "${name}" isminin bir harfiyle başlamalı.
      3. Şiir, kişiye özel, anlamlı ve iltifat edici olmalı.
      ${specialText ? '4. ÖZEL DURUMU MUTLaka dikkate al ve şiire yansıt!' : ''}
      ${specialText ? '5.' : '4.'} Kesinlikle daha önce oluşturulmuş şu metinlerden biri OLMAMALI: "${existingPraises.join('", "')}"
      ${specialText ? '6.' : '5.'} Cevabın sadece ve sadece akrostiş şiirin metnini içermeli. Başka hiçbir açıklama, başlık veya tırnak işareti ekleme. Her mısra yeni bir satırda olsun.
    `;
  } else {
    prompt = `
      Bana şu bilgilere sahip bir kişi için Türkçe, tekil, samimi ve yaratıcı bir övgü cümlesi oluştur:
      - İsim: ${name}
      - Yaş: ${age}
      - Cinsiyet: ${gender}
      - İstenen Üslup: ${selectedStyle.name}
      ${specialText ? `\n      - ÖZEL DURUM: ${specialText}` : ''}

      Kurallar:
      1.  ${selectedStyle.description}
      ${specialText ? '2.  ÖZEL DURUMU MUTLaka dikkate al ve övgüye yansıt! Bu çok önemli!' : ''}
      ${specialText ? '3.' : '2.'}  Kesinlikle daha önce oluşturulmuş şu övgülerden biri OLMAMALI: "${existingPraises.join('", "')}"
      ${specialText ? '4.' : '3.'}  Cevabın sadece ve sadece övgü metnini içermeli. Başka hiçbir açıklama, başlık veya tırnak işareti ekleme. Sadece saf metin olsun.
      ${specialText ? '5.' : '4.'}  Övgü kısa ve etkili olmalı, en fazla 1-2 cümle.
    `;
  }


  try {
    let lastError;
    const maxRetries = 3;
    const baseDelay = 2000; // 2 saniye
    
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
              systemInstruction: "Sen, insanların içindeki potansiyeli gören, sıcakkanlı ve motive edici bir karaktersin. Amacın, kişiye özel ve anlamlı övgülerle onların gününü güzelleştirmek. Konuşma tarzın bilgece ama aynı zamanda modern ve samimi.",
              temperature: 0.9,
              topP: 0.95,
              topK: 40,
            }
        });
        
        return response.text.trim();
      } catch (err: any) {
        lastError = err;
        
        // Quota hatası değilse hemen fırlat
        if (!err?.message?.includes('quota') && 
            !err?.message?.includes('429') && 
            !err?.message?.includes('RESOURCE_EXHAUSTED')) {
          throw err;
        }
        
        // Son deneme ise hata fırlat
        if (attempt === maxRetries - 1) {
          break;
        }
        
        // Exponential backoff: 2s, 4s, 8s
        const delay = baseDelay * Math.pow(2, attempt);
        console.log(`Quota hatası, ${delay}ms sonra tekrar deneniyor... (Deneme ${attempt + 1}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    // Tüm denemeler başarısız
    throw lastError;

  } catch (error: any) {
    console.error("Gemini API call failed:", error);
    
    // Quota hatası kontrolü
    if (error?.message?.includes('quota') || error?.message?.includes('429') || error?.message?.includes('RESOURCE_EXHAUSTED')) {
      throw new Error("⏳ Çok fazla istek gönderildi. Sistem otomatik olarak denedi ama başarısız oldu. Lütfen 1-2 dakika bekleyip tekrar deneyin.");
    }
    
    // Genel hata
    throw new Error("Övgü oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.");
  }
}