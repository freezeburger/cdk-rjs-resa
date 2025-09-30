/**
* Créer un hook "useSpeechSynthesis" pour gérer la synthèse vocale.
* Il utilise l'API Web Speech pour convertir le texte en parole.
* Il permet de lire la synthèse vocale.   
* @param {string} text - Le texte à lire.
* @returns {Object} - Un objet contenant la méthodes pour lire ("speak")
*
* @see https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis
*
* Utilsez les hook d'optimisation de React appropriés.
*/
 
import { useCallback } from "react"
 
 
 
export const useSpeechSynthesis = (text:string):{speak:()=>void} => {
 
    // 1. Vérification si l'API SpeechSynthesis est disponible
    if (!window.speechSynthesis) {
        console.error('L\'API SpeechSynthesis n\'est pas disponible dans ce navigateur.')
        return({ speak:()=>{} })
    }

    //2. Vérification si le texte est vide
    if(text === '') {
        return({ speak:()=>{} })
    }
    
    //3. Vérification si le texte est une chaîne de caractères
    if( text && typeof text !== 'string') {
        console.error('Le texte doit être une chaîne de caractères')
        return({ speak:()=>{} })
    }
 
    return({ speak:useCallback(()=>{
        // 4. Création d'une instance de SpeechSynthesisUtterance
        const utterance = new SpeechSynthesisUtterance(text)
        
        // 5. Lecture du texte
        window.speechSynthesis.speak(utterance)
    }, [text]) })    
}