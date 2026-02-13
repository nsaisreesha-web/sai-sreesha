
import React, { useState, useCallback } from 'react';
import { AppState, BrandInputs, BrandIdentity } from './types';
import { Layout } from './components/Layout';
import { BrandWizard } from './components/BrandWizard';
import { BrandResults } from './components/BrandResults';
import { generateBrandIdentity, generateLogo } from './services/geminiService';
import { Sparkles, ArrowRight, Zap, Target, Palette } from 'lucide-react';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.LANDING);
  const [inputs, setInputs] = useState<BrandInputs | null>(null);
  const [identity, setIdentity] = useState<BrandIdentity | null>(null);
  const [logoUrl, setLogoUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingLogo, setIsLoadingLogo] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStart = () => setAppState(AppState.CONFIGURING);
  const handleReset = () => {
    setAppState(AppState.LANDING);
    setInputs(null);
    setIdentity(null);
    setLogoUrl('');
    setError(null);
  };

  const handleGenerate = async (brandInputs: BrandInputs) => {
    setIsLoading(true);
    setError(null);
    setAppState(AppState.GENERATING);
    setInputs(brandInputs);

    try {
      const result = await generateBrandIdentity(brandInputs);
      setIdentity(result);
      setAppState(AppState.RESULTS);
      
      setIsLoadingLogo(true);
      const logo = await generateLogo(result.name, brandInputs.industry, brandInputs.personality);
      setLogoUrl(logo);
    } catch (err: any) {
      console.error(err);
      setError("Something went wrong with the AI generation. Please try again.");
      setAppState(AppState.CONFIGURING);
    } finally {
      setIsLoading(false);
      setIsLoadingLogo(false);
    }
  };

  const handleRefineLogo = async () => {
    if (!identity || !inputs) return;
    setIsLoadingLogo(true);
    try {
      const logo = await generateLogo(identity.name, inputs.industry, inputs.personality);
      setLogoUrl(logo);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingLogo(false);
    }
  };

  const renderContent = () => {
    switch (appState) {
      case AppState.LANDING:
        return (
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-12rem)] px-4 fade-up">
            <div className="text-center max-w-4xl space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-600 font-semibold text-sm animate-bounce">
                <Sparkles size={16} />
                Now powered by Gemini 3 Flash
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-gray-900 leading-tight fade-up stagger-1">
                Craft Your Brand Identity <br />
                <span className="bg-clip-text text-transparent gradient-bg">In Seconds</span>
              </h1>
              <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed fade-up stagger-2">
                NEURO BRANDX.COM uses advanced Generative AI to automate your entire branding suite. From logos to taglines, we build everything you need to launch.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4 fade-up stagger-3">
                <button 
                  onClick={handleStart}
                  className="px-8 py-4 bg-gray-900 text-white rounded-2xl text-lg font-bold shadow-2xl hover:bg-gray-800 transition-all flex items-center justify-center gap-2 group"
                >
                  Start Branding <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="px-8 py-4 bg-white text-gray-700 border border-gray-200 rounded-2xl text-lg font-bold shadow-lg hover:bg-gray-50 transition-all">
                  View Examples
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-16 fade-up stagger-3">
                {[
                  { icon: <Zap className="text-yellow-500" />, label: 'Instant Generation' },
                  { icon: <Palette className="text-pink-500" />, label: 'Modern Design' },
                  { icon: <Target className="text-indigo-500" />, label: 'Targeted Strategy' },
                  { icon: <Sparkles className="text-purple-500" />, label: 'Unique Output' },
                ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center gap-2 group cursor-default">
                    <div className="p-3 bg-white rounded-2xl shadow-sm border border-gray-100 group-hover:scale-110 transition-transform">{item.icon}</div>
                    <span className="text-sm font-semibold text-gray-600">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case AppState.CONFIGURING:
        return <div className="fade-up"><BrandWizard onGenerate={handleGenerate} /></div>;

      case AppState.GENERATING:
        return (
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-12rem)] space-y-6 fade-up">
            <div className="relative">
              <div className="w-24 h-24 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="text-indigo-400 animate-pulse" size={32} />
              </div>
            </div>
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-gray-900">Crafting your brand...</h2>
              <p className="text-gray-500 animate-pulse">Our AI is dreaming up colors, names, and strategies.</p>
            </div>
          </div>
        );

      case AppState.RESULTS:
        if (!identity) return null;
        return (
          <div className="fade-up">
            <BrandResults 
              identity={identity} 
              logo={logoUrl} 
              onRefineLogo={handleRefineLogo}
              isLoadingLogo={isLoadingLogo}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Layout onReset={handleReset}>
      {error && (
        <div className="max-w-7xl mx-auto px-4 mt-4 fade-up">
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="font-bold">&times;</button>
          </div>
        </div>
      )}
      {renderContent()}
    </Layout>
  );
};

export default App;
