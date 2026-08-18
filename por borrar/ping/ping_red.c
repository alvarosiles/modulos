#include <stdlib.h>

int main(void) {
    return system("gnome-terminal -- bash -c \"/home/servisofts/Desktop/ping/ping_red.sh; echo; echo 'Presiona ENTER para cerrar...'; read\"");
}
