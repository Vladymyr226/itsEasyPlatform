import React, { useEffect, useState } from 'react';
import axios from "axios";

const Index = () => {
    const [form, setForm] = useState('');

    useEffect(() => {
        test();
    }, []);

    useEffect(() => {
        const script_QuizUA = document.createElement('script');
        script_QuizUA.setAttribute('src', 'https://quizua.com/assets/js/quizua.js');
        script_QuizUA.setAttribute('async', '');
        script_QuizUA.onload = function handleScriptLoaded() {
            console.log('script_QuizUA has loaded');
            quiz_UA.addStyles();
            quiz_UA.addModal('https://quizua.com/quiz/687ff116e121009fbdeb0975b2bf5e033730fc7bb322');
            quiz_UA.addButton({
                it1_button_form: 'round-border',
                it1_button_location: 'left-position',
                it1_button_title: 'Заголовок на кнопці',
                it1_button_under_title: 'Підзаголовок на кнопці',
                it1_button_color: '#ff0000',
                it1_button_text_color: '#fff',
                it1_button_blinking: 'animate',
            });
        };
        script_QuizUA.onerror = function handleScriptError() {
            console.log('error loading script_QuizUA');
        };
        document.head.appendChild(script_QuizUA);
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
