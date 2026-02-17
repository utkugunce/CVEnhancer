import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

Font.register({
    family: 'Roboto',
    src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf',
});

const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        padding: 30,
        fontFamily: 'Roboto',
    },
    section: {
        margin: 10,
        padding: 10,
    },
    text: {
        fontSize: 12,
        lineHeight: 1.5,
        marginBottom: 5,
    },
});

interface CVDocumentProps {
    content: string;
}

export const CVDocument = ({ content }: CVDocumentProps) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <View style={styles.section}>
                <Text style={styles.text}>{content}</Text>
            </View>
        </Page>
    </Document>
);
