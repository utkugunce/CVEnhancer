'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { analyzeCV } from '@/actions/analyze-cv';
import { improveText } from '@/actions/improve-cv';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, CheckCircle, AlertTriangle, Wand2, Download, Bot } from 'lucide-react';
import { CVAnalysis } from '@/lib/schemas';
import { CVDocument } from './pdf-document';
import { AIProvider } from '@/lib/ai';

const PDFDownloadLink = dynamic(
    () => import('@react-pdf/renderer').then((mod) => mod.PDFDownloadLink),
    {
        ssr: false,
        loading: () => <Button variant="outline" disabled>Loading PDF...</Button>,
    }
);

interface CVEditorProps {
    initialText: string;
    onReset: () => void;
}

export function CVEditor({ initialText, onReset }: CVEditorProps) {
    const [cvContent, setCvContent] = useState(initialText);
    const [analysis, setAnalysis] = useState<CVAnalysis | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [provider, setProvider] = useState<AIProvider>('openai');

    const handleAnalyze = async () => {
        setIsAnalyzing(true);
        try {
            const result = await analyzeCV(cvContent, provider);
            setAnalysis(result);
        } catch (error) {
            console.error(error);
            alert('Analysis failed. Please try again.');
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-100px)]">
            {/* Left Column: Editor & Controls */}
            <div className="flex flex-col space-y-4 h-full">
                <div className="flex items-center justify-between shrink-0">
                    <h2 className="text-xl font-bold">Your CV</h2>
                    <div className="flex gap-2">
                        <Button variant="ghost" onClick={onReset} size="sm">
                            New Upload
                        </Button>

                        <PDFDownloadLink
                            document={<CVDocument content={cvContent} />}
                            fileName="optimized-cv.pdf"
                        >
                            {({ loading }) => (
                                <Button variant="outline" size="sm" disabled={loading}>
                                    <Download className="mr-2 h-4 w-4" />
                                    {loading ? 'Generating...' : 'Download PDF'}
                                </Button>
                            )}
                        </PDFDownloadLink>
                    </div>
                </div>

                <Textarea
                    className="flex-1 font-mono text-sm resize-none p-4 leading-relaxed"
                    value={cvContent}
                    onChange={(e) => setCvContent(e.target.value)}
                    placeholder="Paste your CV text here..."
                />

                <div className="flex gap-4 items-center shrink-0">
                    <Select value={provider} onValueChange={(val) => setProvider(val as AIProvider)}>
                        <SelectTrigger className="w-[180px]">
                            <div className="flex items-center gap-2">
                                <Bot className="h-4 w-4" />
                                <SelectValue placeholder="Select AI" />
                            </div>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="openai">OpenAI (GPT-4o)</SelectItem>
                            <SelectItem value="google">Google (Gemini)</SelectItem>
                        </SelectContent>
                    </Select>

                    <Button
                        onClick={handleAnalyze}
                        className="flex-1"
                        size="lg"
                        disabled={isAnalyzing}
                    >
                        {isAnalyzing ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Analyzing with {provider === 'openai' ? 'GPT-4o' : 'Gemini'}...
                            </>
                        ) : (
                            <>
                                <Wand2 className="mr-2 h-4 w-4" />
                                Analyze Resume
                            </>
                        )}
                    </Button>
                </div>
            </div>

            {/* Right Column: Analysis & Improvements */}
            <div className="flex flex-col space-y-4 h-full">
                <h2 className="text-xl font-bold shrink-0">AI Feedback</h2>

                {!analysis ? (
                    <div className="flex-1 flex items-center justify-center border-2 border-dashed rounded-lg text-muted-foreground p-12 text-center bg-muted/20">
                        {isAnalyzing ? (
                            <div className="space-y-4">
                                <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
                                <p>Analyzing against global standards using {provider === 'openai' ? 'OpenAI' : 'Gemini'}...</p>
                            </div>
                        ) : (
                            <p>Select your preferred AI model and click analyze.</p>
                        )}
                    </div>
                ) : (
                    <div className="flex-1 overflow-auto pr-2 space-y-6">
                        {/* Score Card */}
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="flex justify-between items-center text-lg">
                                    <span>Resume Score</span>
                                    <div className="flex items-center gap-2">
                                        <span className={`text-2xl font-bold ${analysis.score >= 80 ? 'text-green-600' : analysis.score >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                                            {analysis.score}
                                        </span>
                                        <span className="text-muted-foreground text-sm">/100</span>
                                    </div>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {analysis.summary}
                                </p>
                            </CardContent>
                        </Card>

                        <Tabs defaultValue="suggestions" className="w-full">
                            <TabsList className="w-full grid grid-cols-2">
                                <TabsTrigger value="suggestions">Improvements</TabsTrigger>
                                <TabsTrigger value="strengths">Strengths</TabsTrigger>
                            </TabsList>

                            <TabsContent value="suggestions" className="space-y-4 mt-4">
                                {analysis.suggestions.map((suggestion, idx) => (
                                    <Card key={idx} className="border-l-4 border-l-amber-500">
                                        <CardHeader className="pb-2">
                                            <div className="flex items-center gap-2">
                                                <AlertTriangle className="h-4 w-4 text-amber-500" />
                                                <CardTitle className="text-sm font-medium">
                                                    {suggestion.issue}
                                                </CardTitle>
                                            </div>
                                            <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">
                                                {suggestion.section}
                                            </p>
                                        </CardHeader>
                                        <CardContent className="space-y-3">
                                            <p className="text-sm">{suggestion.recommendation}</p>
                                        </CardContent>
                                    </Card>
                                ))}
                            </TabsContent>

                            <TabsContent value="strengths" className="space-y-4 mt-4">
                                {analysis.strengths.map((strength, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-start gap-3 p-4 bg-green-500/10 rounded-lg border border-green-500/20"
                                    >
                                        <CheckCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                                        <p className="text-sm text-green-800 dark:text-green-300">
                                            {strength}
                                        </p>
                                    </div>
                                ))}
                            </TabsContent>
                        </Tabs>
                    </div>
                )}
            </div>
        </div>
    );
}
