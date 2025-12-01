#ifndef DISP_ESP32_CONEXAO
#define DISP_ESP32_CONEXAO

#include "freertos/FreeRTOS.h"
#include "freertos/event_groups.h"
#include "esp_wifi.h"
#include "esp_log.h"
#include "esp_event.h"
#include "nvs_flash.h"

#define WIFI_SSID "Sistemas_Distribuidos"
#define WIFI_PWD "SD2025.2"

void event_handler(void* arg, esp_event_base_t event_base,
                                int32_t event_id, void* event_data);
void fast_scan(void);

#endif // DISP_ESP32_CONEXAO
