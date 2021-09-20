import { Menu } from './menu.model';

export const verticalMenuItems = [ 
    new Menu (1, 'Dashboard', '/dashboard', null, 'dashboard', null, false, 0),
    new Menu (2, 'Reports', '/reports', null, 'emoji_transportation', null, false, 0),
    new Menu (3, 'Tracking Vehicle', '/tracking-vehicle', null, 'settings_remote', null, false, 0),
    new Menu (4, 'COVID-19', '/covid19', null, 'wash', null, false, 0)
    /* new Menu (4, 'Email Distribution', '/email-distribution', null, 'dynamic_feed', null, false, 0), */
    /* new Menu (5, 'Charts', null, null, 'multiline_chart', null, true, 0),
    new Menu (6, 'Bar Charts', '/charts/bar', null, 'insert_chart', null, false, 5),
    new Menu (7, 'Pie Charts', '/charts/pie', null, 'pie_chart', null, false, 5),
    new Menu (8, 'Line Charts', '/charts/line', null, 'show_chart', null, false, 5),
    new Menu (9, 'Bubble Charts', '/charts/bubble', null, 'bubble_chart', null, false, 5), */
]

export const horizontalMenuItems = [ 
    new Menu (1, 'Dashboard', '/dashboard', null, 'dashboard', null, false, 0),
    new Menu (2, 'Reports', '/reports', null, 'emoji_transportation', null, false, 0),
    new Menu (3, 'Tracking Vehicle', '/tracking-vehicle', null, 'settings_remote', null, false, 0),
    new Menu (4, 'COVID-19', '/covid19', null, 'wash', null, false, 0)
    /* new Menu (4, 'Email Distribution', '/email-distribution', null, 'dynamic_feed', null, false, 0), */
    /* new Menu (3, 'Charts', null, null, 'multiline_chart', null, true, 0),
    new Menu (4, 'Bar Charts', '/charts/bar', null, 'insert_chart', null, false, 3),
    new Menu (5, 'Pie Charts', '/charts/pie', null, 'pie_chart', null, false, 3),
    new Menu (6, 'Line Charts', '/charts/line', null, 'show_chart', null, false, 3),
    new Menu (7, 'Bubble Charts', '/charts/bubble', null, 'bubble_chart', null, false, 3), */
]