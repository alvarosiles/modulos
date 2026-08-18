#include <stdlib.h>

int main(void) {
    return system("gnome-terminal -- bash -c \"/home/servisofts/Desktop/reiniciar/reiniciar_todo.sh; echo; echo 'Presiona ENTER para cerrar...'; read\"");
}
