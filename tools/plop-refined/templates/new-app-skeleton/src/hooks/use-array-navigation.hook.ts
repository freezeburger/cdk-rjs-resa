/**
* use-array-navigation.hooks.js
* Créer un hook "useArrayNavigation" pour gérer la navigation dans un tableau d'éléments.
* Il permet de naviguer entre les éléments du tableau en utilisant les méthodes "previous" et "next".
* Il utilise un état local pour suivre l'index actuel de l'élément sélectionné.
* Il utilise également un effet pour mettre à jour l'index actuel lorsque le tableau change.
* Il retourne l'index actuel, une fonction pour aller à l'élément précédent ("previous") et une fonction pour aller à l'élément suivant ("next").
*
* @param {Array} array - Le tableau d'éléments à naviguer.
* @param {number} initialIndex - L'index initial de l'élément sélectionné.
* @param {number} sliceSize - Le nombre total d'éléments à retourner par tranche.
* @returns {Object} - Un objet contenant l'"index" actuel et la TRANCHE "slice" à l'index actuel, une fonction pour aller à l'élément précédent ("previous") et une fonction pour aller à l'élément suivant ("next").
*/

import { useCallback, useEffect, useMemo, useState } from "react";

export const useArrayNavigation = <T>(array: T[], initialIndex = 0, sliceSize = 5) => {

    const [index, setIndex] = useState(initialIndex);
    const [visibleData, setVisibleData] = useState<T[]>([]);

    const START_INDEX = useMemo(() => Math.min(Math.max(index, 0), array.length), [array, index]);
    const END_INDEX = Math.min(START_INDEX + sliceSize, array.length);

    useEffect(() => {
        setVisibleData(array.slice(START_INDEX, END_INDEX));
    }, [index]);

    return {
        index,
        slice: visibleData,
        previous: useCallback(() => {
            setIndex((cur:number) => Math.max(cur - sliceSize, 0));
        }, [sliceSize]),
        next: useCallback(() => {
            setIndex((cur:number) => Math.min(cur + sliceSize, array.length));
        }, [sliceSize]),
    };
};

