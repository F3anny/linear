import { useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Picker } from '@react-native-picker/picker';
import Slider from '@react-native-community/slider';
import * as DocumentPicker from 'expo-document-picker';
import DateField from '@/components/DateField';
const initial = { name: '', email: '', password: '', phone: '', age: '', website: '', bio: '', course: '', level: 'Beginner', contact: 'Email', interests: [] as string[], notifications: true, terms: false, confidence: 50, rating: 0, color: '#1565c0' };
type Form = typeof initial;
function Section({ number, title, description, children }: {
    number: string;
    title: string;
    description: string;
    children: React.ReactNode;
}) { return <View style={s.card}><View style={s.sectionHeading}><View style={{ flex: 1 }}><Text style={s.sectionTitle}>{title}</Text><Text style={s.caption}>{description}</Text></View></View>{children}</View>; }
export default function FormScreen() {
    const [form, setForm] = useState<Form>({ ...initial });
    const [date, setDate] = useState(new Date());
    const [files, setFiles] = useState<DocumentPicker.DocumentPickerAsset[]>([]);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [showPassword, setShowPassword] = useState(false);
    const [notice, setNotice] = useState('');
    const [submitted, setSubmitted] = useState<Record<string, unknown> | null>(null);
    const update = <K extends keyof Form>(key: K, value: Form[K]) => { setForm(previous => ({ ...previous, [key]: value })); setErrors(previous => ({ ...previous, [key]: '' })); setSubmitted(null); setNotice(''); };
    const details = () => ({ ...form, name: form.name.trim(), email: form.email.trim(), password: '[hidden for privacy]', age: form.age ? Number(form.age) : null, preferredDate: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`, preferredTime: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }), attachments: files.map(({ name, size, mimeType, uri }) => ({ name, size, mimeType, uri })) });
    const submit = () => { const next: Record<string, string> = {}; if (!form.name.trim())
        next.name = 'Please enter your full name.'; if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
        next.email = 'Enter a valid email address.'; if (form.password.length < 8)
        next.password = 'Use at least 8 characters.'; if (form.phone && !/^\+?[\d\s()-]{7,20}$/.test(form.phone))
        next.phone = 'Enter a valid phone number.'; if (form.age && (!/^\d+$/.test(form.age) || Number(form.age) < 1 || Number(form.age) > 120))
        next.age = 'Enter an age between 1 and 120.'; if (form.website && !/^https?:\/\/[^\s.]+\.[^\s]+$/i.test(form.website))
        next.website = 'Use a full URL, such as https://example.com.'; if (!form.course)
        next.course = 'Choose a course.'; if (!form.terms)
        next.terms = 'Please accept the declaration.'; setErrors(next); if (Object.keys(next).length) {
        setNotice('Please correct the highlighted fields.');
        setSubmitted(null);
        return;
    } const payload = details(); setSubmitted(payload); setNotice('Success! Your form has been submitted locally.'); console.log('FORM SUBMITTED', payload); };
    const upload = async () => { try {
        const result = await DocumentPicker.getDocumentAsync({ type: '*/*', multiple: true, copyToCacheDirectory: true });
        if (result.canceled)
            return;
        const allowed = result.assets.filter(file => (file.size ?? 0) <= 10 * 1024 * 1024);
        setFiles(previous => [...previous, ...allowed].filter((file, index, all) => all.findIndex(other => other.uri === file.uri) === index));
        setSubmitted(null);
        setNotice(allowed.length !== result.assets.length ? 'Files larger than 10 MB were skipped.' : `${allowed.length} file(s) attached.`);
    }
    catch {
        setNotice('Could not open the file picker. Please try again.');
    } };
    const field = (key: 'name' | 'email' | 'password' | 'phone' | 'age' | 'website' | 'bio', label: string, placeholder: string, keyboardType: 'default' | 'email-address' | 'phone-pad' | 'number-pad' | 'url' = 'default') => <View style={s.field}><Text style={s.label}>{label}</Text><TextInput accessibilityLabel={label} style={[s.input, key === 'bio' && s.textarea, !!errors[key] && s.invalid]} value={form[key]} onChangeText={text => update(key, text)} placeholder={placeholder} placeholderTextColor="#8793a7" keyboardType={keyboardType} autoCapitalize={['email', 'password', 'website'].includes(key) ? 'none' : 'sentences'} secureTextEntry={key === 'password' && !showPassword} multiline={key === 'bio'} maxLength={key === 'bio' ? 500 : undefined}/>{errors[key] && <Text style={s.error}>{errors[key]}</Text>}{key === 'bio' && <Text style={s.hint}>{form.bio.length}/500 characters</Text>}</View>;
    const choices = (key: 'level' | 'contact', options: string[]) => <View style={s.wrap}>{options.map(option => <Pressable key={option} accessibilityRole="radio" accessibilityState={{ checked: form[key] === option }} onPress={() => update(key, option)} style={[s.chip, form[key] === option && s.selected]}><Text style={[s.chipText, form[key] === option && s.selectedText]}>{form[key] === option ? '◉  ' : '○  '}{option}</Text></Pressable>)}</View>;
    return <SafeAreaView style={s.safe}><StatusBar style="dark"/><KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}><ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={s.page}>
 <View style={s.header}><Text style={s.title}>Student Form</Text><Text style={s.caption}>Fill in your details. Fields marked * are required.</Text></View>
 <Section number="01" title="The essentials" description="Introduce yourself with the basics.">
 {field('name', 'Full name *', 'e.g. Alex Mugisha')}<View style={s.row}><View style={s.column}>{field('email', 'Email address *', 'you@example.com', 'email-address')}</View><View style={s.column}>{field('phone', 'Phone number', '+250 7xx xxx xxx', 'phone-pad')}</View></View>
 {field('password', 'Password *', 'At least 8 characters')}<Pressable accessibilityRole="checkbox" accessibilityState={{ checked: showPassword }} onPress={() => setShowPassword(!showPassword)}><Text style={s.link}>{showPassword ? '☑' : '☐'} Show password</Text></Pressable>
 <View style={s.row}><View style={s.column}>{field('age', 'Age', 'e.g. 21', 'number-pad')}</View><View style={s.column}>{field('website', 'Portfolio URL', 'https://your-site.com', 'url')}</View></View>{field('bio', 'Short bio', 'Tell us about yourself and what you want to build…')}
 </Section>
 <Section number="02" title="Your learning journey" description="Pick your path and personalize your experience.">
 <Text style={s.label}>Course *</Text><View style={[s.picker, !!errors.course && s.invalid]}><Picker accessibilityLabel="Course" selectedValue={form.course} onValueChange={value => update('course', value)} style={{ color: '#17233b' }}><Picker.Item label="Select your course…" value=""/>{['Mobile Application Development', 'Web Development', 'UI / UX Design', 'Data Science', 'Computer Networking'].map(course => <Picker.Item key={course} label={course} value={course}/>)}</Picker></View>{errors.course && <Text style={s.error}>{errors.course}</Text>}
 <Text style={s.label}>Experience level</Text>{choices('level', ['Beginner', 'Intermediate', 'Advanced'])}
 <Text style={s.label}>Interests · select multiple</Text><View style={s.wrap}>{['Design', 'Coding', 'AI', 'Photography', 'Robotics', 'Gaming'].map(interest => { const selected = form.interests.includes(interest); return <Pressable key={interest} accessibilityRole="checkbox" accessibilityState={{ checked: selected }} style={[s.chip, selected && s.selected]} onPress={() => update('interests', selected ? form.interests.filter(item => item !== interest) : [...form.interests, interest])}><Text style={[s.chipText, selected && s.selectedText]}>{selected ? '✓' : '+'}  {interest}</Text></Pressable>; })}</View>
 <View style={s.between}><Text style={s.label}>Confidence with technology</Text><Text style={s.value}>{form.confidence}%</Text></View><Slider accessibilityLabel="Confidence with technology" value={form.confidence} minimumValue={0} maximumValue={100} step={1} onValueChange={value => update('confidence', value)} minimumTrackTintColor="#1565c0" maximumTrackTintColor="#e2e8f0" thumbTintColor="#1565c0"/><View style={s.between}><Text style={s.hint}>Just getting started</Text><Text style={s.hint}>Ready to build</Text></View>
 <Text style={s.label}>How excited are you?</Text><View style={s.wrap}>{[1, 2, 3, 4, 5].map(rating => <Pressable key={rating} accessibilityRole="button" accessibilityLabel={`Rate ${rating} out of 5`} accessibilityState={{ selected: form.rating === rating }} onPress={() => update('rating', rating)}><Text style={{ fontSize: 28, color: rating <= form.rating ? '#f59e0b' : '#cbd5e1' }}>★</Text></Pressable>)}<Text style={s.caption}>{form.rating ? `${form.rating} / 5` : 'Tap a star'}</Text></View>
 <Text style={s.label}>Choose your profile color</Text><View style={s.wrap}>{['#1565c0', '#0d9488', '#f59e0b', '#f43f5e', '#8b5cf6'].map(color => <Pressable key={color} accessibilityRole="radio" accessibilityLabel={`Profile color ${color}`} accessibilityState={{ checked: form.color === color }} onPress={() => update('color', color)} style={[s.swatch, { backgroundColor: color }]}><Text style={{ color: '#fff', fontWeight: '800' }}>{form.color === color ? '✓' : ''}</Text></Pressable>)}</View>
 </Section>
 <Section number="03" title="Make it personal" description="Choose a date and attach something you’re proud of.">
 <View style={s.row}><View style={s.column}><Text style={s.label}>Preferred date</Text><DateField mode="date" value={date} onChange={value => { setDate(value); setSubmitted(null); }}/></View><View style={s.column}><Text style={s.label}>Preferred time</Text><DateField mode="time" value={date} onChange={value => { setDate(value); setSubmitted(null); }}/></View></View>
 <Pressable accessibilityRole="button" onPress={upload} style={s.upload}><Text style={s.label}>Choose files</Text><Text style={s.caption}>Tap to browse photos, documents, or a portfolio</Text><Text style={s.hint}>Multiple files · up to 10 MB each</Text></Pressable>
 {files.map(file => <View key={file.uri} style={s.fileRow}>{file.mimeType?.startsWith('image/') ? <Image source={{ uri: file.uri }} style={s.thumbnail}/> : <View style={s.fileIcon}><Text>▤</Text></View>}<View style={{ flex: 1 }}><Text style={s.label} numberOfLines={1}>{file.name}</Text><Text style={s.hint}>{file.size === undefined ? 'Size unavailable' : `${(file.size / 1024).toFixed(1)} KB`}</Text></View><Pressable accessibilityRole="button" accessibilityLabel={`Remove ${file.name}`} onPress={() => { setFiles(previous => previous.filter(item => item.uri !== file.uri)); setSubmitted(null); }}><Text style={s.link}>Remove</Text></Pressable></View>)}
 <Text style={s.hint}>Files are attached locally for this demo. No server upload is configured.</Text>
 </Section>
 <Section number="04" title="The finishing touches" description="A few preferences before you’re all set.">
 <Text style={s.label}>Preferred contact method</Text>{choices('contact', ['Email', 'Phone', 'SMS'])}<View style={s.toggleRow}><View style={{ flex: 1 }}><Text style={s.label}>Keep me in the loop</Text><Text style={s.caption}>Receive project news and learning updates.</Text></View><Switch accessibilityLabel="Receive learning updates" value={form.notifications} onValueChange={value => update('notifications', value)} trackColor={{ false: '#cbd5e1', true: '#1565c0' }}/></View>
 <Pressable accessibilityRole="checkbox" accessibilityState={{ checked: form.terms }} onPress={() => update('terms', !form.terms)} style={s.terms}><View style={[s.checkbox, form.terms && { backgroundColor: '#1565c0', borderColor: '#1565c0' }]}><Text style={{ color: '#fff' }}>{form.terms ? '✓' : ''}</Text></View><Text style={[s.caption, { flex: 1 }]}>I confirm these details are correct and agree to submit this demonstration form. *</Text></Pressable>{errors.terms && <Text style={s.error}>{errors.terms}</Text>}
 {!!notice && <View accessibilityLiveRegion="polite" style={[s.notice, submitted && { backgroundColor: '#fff' }]}><Text style={{ color: submitted ? '#047857' : '#1565c0', lineHeight: 21 }}>{notice}</Text></View>}
 <View style={s.row}><Pressable accessibilityRole="button" onPress={submit} style={[s.button, s.column]}><Text style={s.buttonText}>Submit form</Text></Pressable><Pressable accessibilityRole="button" style={[s.button, s.secondary, s.column]} onPress={() => { console.log('FORM DETAILS', details()); setNotice('Form details logged. Open the development console to inspect them.'); }}><Text style={[s.buttonText, { color: '#1565c0' }]}>Log form details</Text></Pressable></View>
 <Pressable accessibilityRole="button" style={{ alignSelf: 'center', padding: 16 }} onPress={() => { setForm({ ...initial }); setFiles([]); setErrors({}); setNotice(''); setSubmitted(null); setShowPassword(false); setDate(new Date()); }}><Text style={s.caption}>Reset all fields</Text></Pressable>
 </Section>
 </ScrollView></KeyboardAvoidingView></SafeAreaView>;
}
const s = StyleSheet.create({
    safe: { flex: 1, backgroundColor: '#fff' },
    page: { padding: 16, paddingBottom: 32, width: '100%', maxWidth: 650, alignSelf: 'center', gap: 20 },
    header: { gap: 8 },
    title: { fontSize: 24, fontWeight: 'bold', color: '#222' },
    card: { gap: 12, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#ddd' },
    sectionHeading: { marginBottom: 4 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#222' },
    caption: { fontSize: 14, color: '#555', lineHeight: 20 },
    field: { gap: 6 },
    label: { color: '#222', fontSize: 14, marginTop: 4 },
    input: { borderWidth: 1, borderColor: '#aaa', padding: 10, fontSize: 16, color: '#222', minHeight: 44 },
    textarea: { minHeight: 100, textAlignVertical: 'top' },
    row: { gap: 12 },
    column: { gap: 6 },
    hint: { color: '#666', fontSize: 12, lineHeight: 18 },
    link: { color: '#1565c0', fontSize: 14, paddingVertical: 8 },
    invalid: { borderColor: '#c62828' },
    error: { color: '#c62828', fontSize: 13 },
    picker: { borderWidth: 1, borderColor: '#aaa' },
    wrap: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 8 },
    chip: { padding: 10, borderWidth: 1, borderColor: '#aaa' },
    selected: { borderColor: '#1565c0', backgroundColor: '#eee' },
    chipText: { fontSize: 14, color: '#222' },
    selectedText: { color: '#1565c0' },
    between: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'space-between', alignItems: 'center' },
    value: { color: '#222' },
    swatch: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
    upload: { borderWidth: 1, borderColor: '#aaa', padding: 12, gap: 6 },
    fileRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#ddd' },
    thumbnail: { width: 44, height: 44 },
    fileIcon: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
    toggleRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 8 },
    terms: { flexDirection: 'row', gap: 12, alignItems: 'center', paddingVertical: 8 },
    checkbox: { width: 24, height: 24, borderWidth: 1, borderColor: '#aaa', alignItems: 'center', justifyContent: 'center' },
    notice: { paddingVertical: 10 },
    button: { backgroundColor: '#1565c0', padding: 12, alignItems: 'center' },
    secondary: { backgroundColor: '#eee', borderWidth: 1, borderColor: '#aaa' },
    buttonText: { color: '#fff', fontSize: 16 },
});
