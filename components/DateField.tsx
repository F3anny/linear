import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { Platform, Pressable, Text, View } from 'react-native';
export default function DateField({ value, onChange, mode }: {
    value: Date;
    onChange: (date: Date) => void;
    mode: 'date' | 'time';
}) {
    const [open, setOpen] = useState(false);
    const pad = (n: number) => String(n).padStart(2, '0');
    if (Platform.OS === 'web')
        return <input aria-label={`Preferred ${mode}`} type={mode} value={mode === 'date' ? `${value.getFullYear()}-${pad(value.getMonth() + 1)}-${pad(value.getDate())}` : `${pad(value.getHours())}:${pad(value.getMinutes())}`} onChange={event => {
                if (!event.target.value)
                    return;
                const next = new Date(value);
                const parts = event.target.value.split(mode === 'date' ? '-' : ':').map(Number);
                if (mode === 'date')
                    next.setFullYear(parts[0], parts[1] - 1, parts[2]);
                else
                    next.setHours(parts[0], parts[1]);
                onChange(next);
            }} style={{ width: '100%', boxSizing: 'border-box', padding: 10, border: '1px solid #aaa', background: '#fff', color: '#222', fontSize: 15, fontFamily: 'inherit' }}/>;
    return <View><Pressable accessibilityRole="button" onPress={() => setOpen(true)} style={{ padding: 10, borderWidth: 1, borderColor: '#aaa', backgroundColor: '#fff' }}><Text>{mode === 'date' ? value.toLocaleDateString() : value.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text></Pressable>{open && <DateTimePicker value={value} mode={mode} onChange={(event, date) => { setOpen(Platform.OS === 'ios' && event.type !== 'dismissed'); if (date)
        onChange(date); }}/>}{open && Platform.OS === 'ios' && <Pressable onPress={() => setOpen(false)}><Text style={{ padding: 12, color: '#1565c0' }}>Done</Text></Pressable>}</View>;
}
