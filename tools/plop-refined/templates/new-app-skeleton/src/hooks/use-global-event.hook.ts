/**
* 1. Composables Hooks
* Crée un hook pour gérer les événements globaux dans une application React.
* @param eventName - Le nom de l'événement à écouter (ex: 'resize', 'scroll', etc.).
* @param callback - La fonction à exécuter lorsque l'événement est déclenché.
*/
 
import { useEffect } from "react";
 
 
/**
* Le nom de l'événement à écouter (ex: 'resize', 'scroll', etc.).
*/
type EventName = keyof WindowEventMap;
 
/**
*  La fonction à exécuter lorsque l'événement est déclenché.
*/
type Callback= EventListener;
 
const windowDefined = typeof window !== 'undefined';

export const useGlobalEvent = (eventName:EventName, callback:Callback )=> {
    // 2. Utilisation de useEffect pour ajouter et supprimer l'écouteur d'événement
    useEffect(() => {
        // 3. Vérification si window existe
        windowDefined && window.addEventListener(eventName, callback);
 
        // 4. Fonction de nettoyage pour supprimer l'écouteur d'événement
        return () => {
            windowDefined && window.removeEventListener(eventName, callback);
        }
 
    },[eventName,callback]) // 5. Dépendances de useEffect
   
}
