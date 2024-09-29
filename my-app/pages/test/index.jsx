import React, { useEffect, useState } from 'react';
import axios from "axios";

const Index = () => {
    const [form, setForm] = useState('');

    useEffect(() => {
        test();
    }, []);

    useEffect(() => {
        if (form) {
            // Знаходимо input[type="image"]
            const inputImage = document.querySelector('input[type="image"]');
            if (inputImage) {
                // Створюємо новий елемент кнопки
                const button = document.createElement('button');
                button.innerText = 'Сплатити';
                button.type = 'submit';  // Надаємо кнопці тип submit, щоб вона виконувала дію форми

                // Додаємо стилі для кнопки
                button.style.height = '60px';
                button.style.borderRadius = '8px';
                button.style.cursor = 'pointer';
                button.style.width = '100%';
                button.style.marginTop = '14px';
                button.style.paddingTop = '11px';
                button.style.paddingBottom = '11px';
                button.style.border = 'none';
                button.style.fontWeight = '700';
                button.style.fontSize = '16px';
                button.style.lineHeight = '20px';
                button.style.textAlign = 'center';
                button.style.background = 'red';
                button.style.color = 'white';
                button.style.borderRadius = '7px';

                // Замінюємо input[type="image"] на нашу кнопку
                inputImage.replaceWith(button);
            }
        }
    }, [form]);

    const test = async () => {
        const response = await axios.post('https://its-easy-platform-back-end.vercel.app/api/payment/redirect');
        setForm(response.data);
    };

    return (
        <div>
            <h2>TEST</h2>
            <div dangerouslySetInnerHTML={{ __html: form }} />
        </div>
    );
};

export default Index;
