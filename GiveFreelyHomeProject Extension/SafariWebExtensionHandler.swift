//
//  SafariWebExtensionHandler.swift
//  GiveFreelyHomeProject Extension
//
//  Created by Felipe Moreira Tarrio Bassi on 31/01/24.
//

import SafariServices
import os.log

class SafariWebExtensionHandler: NSObject, NSExtensionRequestHandling {

    func beginRequest(with context: NSExtensionContext) {
        let request = context.inputItems.first as? NSExtensionItem

        let profile: UUID?
        profile = request?.userInfo?[SFExtensionProfileKey] as? UUID

        let message: Any?
        message = request?.userInfo?[SFExtensionMessageKey]

        os_log(.default, "Received message from browser.runtime.sendNativeMessage: %@ (profile: %@)", String(describing: message), profile?.uuidString ?? "none")

        let response = NSExtensionItem()
        response.userInfo = [ SFExtensionMessageKey: [ "echo": message ] ]

        context.completeRequest(returningItems: [ response ], completionHandler: nil)
    }

}
